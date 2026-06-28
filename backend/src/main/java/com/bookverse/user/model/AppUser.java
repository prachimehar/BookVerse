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

    // ✅ SINGLE SOURCE OF TRUTH
    private List<String> roles = new ArrayList<>(List.of("ROLE_READER"));

    private boolean banned;
    private String provider = "local";
    private String writerProfileId;

    @JsonIgnore
    private String passwordResetToken;

    @JsonIgnore
    private Instant passwordResetExpiresAt;
}