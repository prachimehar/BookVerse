package com.bookverse.auth.dto;

import java.util.List;

public record AuthResponse(UserDto user, String accessToken, String refreshToken, String tokenType) {
    public record UserDto(String id, String name, String email, String avatar, List<String> roles) {
    }
}
