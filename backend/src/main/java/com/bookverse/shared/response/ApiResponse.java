package com.bookverse.shared.response;

public record ApiResponse<T>(T data, String message, boolean success) {
}
