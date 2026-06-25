package com.bookverse.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class AppUser {
    @Id
    private String id;
    private String name;
    private String email;
    private String avatar;
    @JsonIgnore
    private String passwordHash;
    @JsonIgnore
    private String role;
    private List<String> roles = new ArrayList<>(List.of("reader"));
    private boolean banned;
    private String provider = "local";
    private String writerProfileId;
    @JsonIgnore
    private String passwordResetToken;
    @JsonIgnore
    private Instant passwordResetExpiresAt;

    public List<String> getRoles() {
        if ((roles == null || roles.isEmpty()) && role != null && !role.isBlank()) {
            roles = new ArrayList<>(List.of(role.toLowerCase()));
        }
        if (roles == null || roles.isEmpty()) {
            roles = new ArrayList<>(List.of("reader"));
        }
        if (!(roles instanceof ArrayList<?>)) {
            roles = new ArrayList<>(roles);
        }
        return roles;
    }
}
