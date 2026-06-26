package com.bookverse.security;

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

    public static BookVersePrincipal from(com.bookverse.user.model.AppUser user) {
        return new BookVersePrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles()
        );
    }

    // ✅ FIXED ROLE MAPPING (THIS WAS YOUR MAIN BUG)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(r -> {
                    String role = r.toUpperCase().startsWith("ROLE_")
                            ? r.toUpperCase()
                            : "ROLE_" + r.toUpperCase();
                    return new SimpleGrantedAuthority(role);
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

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}