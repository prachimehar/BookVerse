package com.bookverse.purchase.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "purchases")
public class Purchase {
    @Id
    private String id;
    private String userId;
    private String bookId;
    private int amount;
    private Instant purchasedAt;
}
