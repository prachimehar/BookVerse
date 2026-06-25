package com.bookverse.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static BookVersePrincipal currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof BookVersePrincipal principal)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication is required");
        }
        return principal;
    }

    public static boolean hasRole(String role) {
        return currentUser().roles().stream().anyMatch(value -> value.equalsIgnoreCase(role));
    }
}
