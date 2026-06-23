package com.bookverse.auth.controller;

import com.bookverse.auth.dto.AuthResponse;
import com.bookverse.auth.model.RefreshToken;
import com.bookverse.auth.repository.RefreshTokenRepository;
import com.bookverse.user.model.AppUser;
import com.bookverse.user.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthController(AppUserRepository userRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping("/demo")
    public ResponseEntity<AuthResponse> demoLogin(@RequestParam(defaultValue = "reader") String role) {
        String normalizedRole = role.equalsIgnoreCase("admin") ? "admin" : role.equalsIgnoreCase("writer") ? "writer" : "reader";
        String email = normalizedRole + "@bookverse.app";

        AppUser user = userRepository.findByEmail(email).orElseGet(AppUser::new);
        user.setName(normalizedRole.equals("admin") ? "BookVerse Admin" : normalizedRole.equals("writer") ? "BookVerse Writer" : "BookVerse Guest");
        user.setEmail(email);
        user.setRole(normalizedRole);
        user.setAvatar("https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80");
        user.setBanned(false);
        AppUser savedUser = userRepository.save(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(savedUser.getId());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setExpiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7));
        refreshTokenRepository.save(refreshToken);

        return ResponseEntity.ok(new AuthResponse(
                savedUser,
                "demo-access-" + UUID.randomUUID(),
                refreshToken.getToken(),
                "Bearer"
        ));
    }
}
