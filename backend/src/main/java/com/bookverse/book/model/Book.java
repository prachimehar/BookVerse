package com.bookverse.book.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "books")
public class Book {
    @Id
    private String id;
    private String title;
    private String author;
    private String writerId;
    private String genre;
    private double rating;
    private int price;
    private String cover;
    private String description;
    private List<String> tags = new ArrayList<>();
    private long followers;
    private String status;
    private String approvalStatus;
    private List<Chapter> chapters = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
    
}
