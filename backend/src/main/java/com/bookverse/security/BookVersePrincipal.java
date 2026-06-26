package com.bookverse.security;

import com.bookverse.user.model.AppUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record BookVersePrincipal(
        String id,
        String name,
        String email,
        List<String> roles
) implements UserDetails {
    public static BookVersePrincipal from(AppUser user) {
        return new BookVersePrincipal(user.getId(), user.getName(), user.getEmail(), user.getRoles());
    }

 @Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.stream()
            .map(role -> {
                String normalized = role.toUpperCase();

                if (!normalized.startsWith("ROLE_")) {
                    normalized = "ROLE_" + normalized;
                }

                return new SimpleGrantedAuthority(normalized);
            })
            .toList();
}

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
