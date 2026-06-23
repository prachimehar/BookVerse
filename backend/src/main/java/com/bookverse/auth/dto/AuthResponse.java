package com.bookverse.auth.dto;

import com.bookverse.user.model.AppUser;

public record AuthResponse(AppUser user, String accessToken, String refreshToken, String tokenType) {
}
