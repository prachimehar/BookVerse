package com.bookverse.library.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "library_items")
public class LibraryItem {
    @Id
    private String id;
    private String userId;
    private String bookId;
    private Instant createdAt;
}
