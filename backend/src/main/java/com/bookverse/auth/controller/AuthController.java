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
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;

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

    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {

        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoles(new ArrayList<>(List.of("ROLE_READER")));
        user.setProvider("local");
        user.setBanned(false);

        return issueTokens(userRepository.save(user));
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {

        AppUser user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (user.isBanned()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }

        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return issueTokens(user);
    }

    // ---------------- GOOGLE LOGIN ----------------
    @PostMapping("/google")
    public AuthResponse googleLogin(@Valid @RequestBody GoogleAuthRequest request) {

        GoogleUserInfo googleUser = googleTokenVerifier.verify(request.credential());

        String email = normalizeEmail(googleUser.email());

        AppUser user = userRepository.findByEmail(email).orElseGet(() -> {
            AppUser u = new AppUser();
            u.setEmail(email);
            u.setRoles(new ArrayList<>(List.of("ROLE_READER")));
            u.setProvider("google");
            u.setBanned(false);
            return u;
        });

        if (user.isBanned()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }

        user.setName(googleUser.name());
        user.setAvatar(googleUser.picture());

        return issueTokens(userRepository.save(user));
    }

    // ---------------- REFRESH ----------------
    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody(required = false) RefreshRequest request) {

        if (request == null || request.refreshToken() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        }

        RefreshToken token = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh expired");
        }

        AppUser user = userRepository.findById(token.getUserId())
                .filter(u -> !u.isBanned())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User invalid"));

        return new AuthResponse(
                toUserDto(user),
                jwtService.createAccessToken(user),
                request.refreshToken(),
                "Bearer"
        );
    }

    // ---------------- ME ----------------
    @GetMapping("/me")
    public AuthResponse.UserDto me() {
        return userRepository.findById(SecurityUtils.currentUser().id())
                .map(this::toUserDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    // ---------------- BECOME WRITER ----------------
    @PostMapping("/become-writer")
public AuthResponse becomeWriter() {

    AppUser user = userRepository.findById(SecurityUtils.currentUser().id())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

    if (user.getRoles() == null) {
        user.setRoles(new ArrayList<>());
    }

    if (user.getRoles().stream().noneMatch(r -> r.equals("ROLE_WRITER"))) {
        user.getRoles().add("ROLE_WRITER");
    }

    return issueTokens(userRepository.save(user));
}

    // ---------------- TOKENS ----------------
    private AuthResponse issueTokens(AppUser user) {

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setExpiresAt(
                Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration())
        );

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
                toUserDto(user),
                jwtService.createAccessToken(user),
                refreshToken.getToken(),
                "Bearer"
        );
    }

    private AuthResponse.UserDto toUserDto(AppUser user) {
        return new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatar(),
                user.getRoles()
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    // ---------------- DTOs ----------------
    public record SignupRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 6) String password,
            @Size(min = 6) String confirmPassword
    ) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}

    public record GoogleAuthRequest(@NotBlank String credential) {}

    public record RefreshRequest(String refreshToken) {}
}