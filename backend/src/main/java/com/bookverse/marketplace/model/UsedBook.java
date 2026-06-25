package com.bookverse.marketplace.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "used_books")
public class UsedBook {
    @Id
    private String id;
    private String sellerId;
    private String sellerName;
    private String title;
    private String author;
    private String genre;
    private String description;
    private int originalPrice;
    private int sellingPrice;
    private String condition;
    private List<String> images;
    private String city;
    private String contact;
    private boolean approved;
    private boolean sold;
    private Instant createdAt;
}
