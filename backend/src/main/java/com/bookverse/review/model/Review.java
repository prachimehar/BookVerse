package com.bookverse.review.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String bookId;
    private String reviewer;
    private String avatar;
    private double rating;
    private String comment;
    private boolean reviewed;
}
