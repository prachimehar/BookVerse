package com.bookverse.user.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class AppUser {
    @Id
    private String id;
    private String name;
    private String email;
    private String avatar;
    private String role;
    private boolean banned;
}
