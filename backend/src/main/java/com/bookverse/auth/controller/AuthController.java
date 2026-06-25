package com.bookverse.auth.controller;

import com.bookverse.auth.dto.AuthResponse;
import com.bookverse.auth.model.RefreshToken;
import com.bookverse.auth.repository.RefreshTokenRepository;
import com.bookverse.security.SecurityUtils;
import com.bookverse.security.jwt.JwtProperties;
import com.bookverse.security.jwt.JwtService;
import com.bookverse.security.oauth.GoogleTokenVerifier;
import com.bookverse.security.oauth.GoogleUserInfo;
import com.bookverse.user.model.AppUser;
import com.bookverse.user.repository.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final GoogleTokenVerifier googleTokenVerifier;

    public AuthController(
            AppUserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties,
            GoogleTokenVerifier googleTokenVerifier) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoles(new ArrayList<>(List.of("reader")));
        user.setProvider("local");
        user.setBanned(false);
        return issueTokens(userRepository.save(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        AppUser user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        if (user.isBanned()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is disabled");
        }
        return issueTokens(userRepository.save(user));
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        GoogleUserInfo googleUser = googleTokenVerifier.verify(request.credential());
        String email = normalizeEmail(googleUser.email());
        AppUser user = userRepository.findByEmail(email).orElseGet(AppUser::new);
        if (user.getId() == null) {
            user.setEmail(email);
            user.setRoles(new ArrayList<>(List.of("reader")));
            user.setProvider("google");
            user.setBanned(false);
        }
        user.setName(googleUser.name());
        user.setAvatar(googleUser.picture());
        if (user.isBanned()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is disabled");
        }
        return issueTokens(userRepository.save(user));
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }
        AppUser user = userRepository.findById(refreshToken.getUserId())
                .filter(value -> !value.isBanned())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        return new AuthResponse(toUserDto(user), jwtService.createAccessToken(user), request.refreshToken(), "Bearer");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody(required = false) RefreshRequest request) {
        if (request != null && request.refreshToken() != null && !request.refreshToken().isBlank()) {
            refreshTokenRepository.findByToken(request.refreshToken()).ifPresent(refreshTokenRepository::delete);
        } else {
            refreshTokenRepository.deleteByUserId(SecurityUtils.currentUser().id());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return userRepository.findByEmail(normalizeEmail(request.email()))
                .map(user -> {
                    String token = UUID.randomUUID().toString();
                    user.setPasswordResetToken(token);
                    user.setPasswordResetExpiresAt(Instant.now().plusSeconds(60 * 30));
                    userRepository.save(user);
                    return Map.of(
                            "message", "If the email exists, a reset link has been prepared.",
                            "devResetToken", token
                    );
                })
                .orElseGet(() -> Map.of("message", "If the email exists, a reset link has been prepared."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }
        AppUser user = userRepository.findAll().stream()
                .filter(value -> request.token().equals(value.getPasswordResetToken()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token"));
        if (user.getPasswordResetExpiresAt() == null || user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token expired");
        }
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        userRepository.save(user);
        refreshTokenRepository.deleteByUserId(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public AuthResponse.UserDto me() {
        return userRepository.findById(SecurityUtils.currentUser().id())
                .map(this::toUserDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required"));
    }

    @PostMapping("/become-writer")
    public AuthResponse becomeWriter() {
        AppUser user = userRepository.findById(SecurityUtils.currentUser().id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required"));
        if (user.getRoles().stream().noneMatch("writer"::equalsIgnoreCase)) {
            user.getRoles().add("writer");
        }
        return issueTokens(userRepository.save(user));
    }

    private AuthResponse issueTokens(AppUser user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setExpiresAt(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration()));
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(toUserDto(user), jwtService.createAccessToken(user), refreshToken.getToken(), "Bearer");
    }

    private AuthResponse.UserDto toUserDto(AppUser user) {
        return new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getRoles());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    public record SignupRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 6) String password,
            @Size(min = 6) String confirmPassword
    ) {
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record GoogleAuthRequest(@NotBlank String credential) {
    }

    public record RefreshRequest(String refreshToken) {
    }

    public record ForgotPasswordRequest(@Email @NotBlank String email) {
    }

    public record ResetPasswordRequest(@NotBlank String token, @Size(min = 6) String password, @Size(min = 6) String confirmPassword) {
    }
}
