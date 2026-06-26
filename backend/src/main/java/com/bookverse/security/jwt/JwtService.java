package com.bookverse.security.jwt;

import com.bookverse.shared.constants.SecurityConstants;
import com.bookverse.user.model.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final JwtProperties properties;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
    }

    // ✅ ALWAYS STORE CLEAN ROLE FORMAT: ROLE_WRITER, ROLE_ADMIN, ROLE_READER
    public String createAccessToken(AppUser user) {
        Instant now = Instant.now();

        List<String> roles = user.getRoles().stream()
                .map(r -> r.toUpperCase().startsWith("ROLE_") ? r.toUpperCase() : "ROLE_" + r.toUpperCase())
                .toList();

        return Jwts.builder()
                .setIssuer(properties.getIssuer())
                .setSubject(user.getId())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim(SecurityConstants.TOKEN_CLAIM_ROLES, roles)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(properties.getAccessTokenExpiration())))
                .signWith(Keys.hmacShaKeyFor(signingKey()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(signingKey()))
                .requireIssuer(properties.getIssuer())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ SAFE ROLE EXTRACTION
    public List<String> roles(Claims claims) {
        Object roles = claims.get(SecurityConstants.TOKEN_CLAIM_ROLES);

        if (roles instanceof List<?> list) {
            return list.stream()
                    .map(String::valueOf)
                    .map(r -> r.toUpperCase().startsWith("ROLE_") ? r.toUpperCase() : "ROLE_" + r.toUpperCase())
                    .toList();
        }

        return List.of("ROLE_READER");
    }

    private byte[] signingKey() {
        try {
            return MessageDigest.getInstance("SHA-256")
                    .digest(properties.getSecret().getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is unavailable", ex);
        }
    }
}