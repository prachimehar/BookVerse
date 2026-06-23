package com.bookverse.purchase.repository;

import com.bookverse.purchase.model.Purchase;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends MongoRepository<Purchase, String> {
    List<Purchase> findByUserId(String userId);
    Optional<Purchase> findByUserIdAndBookId(String userId, String bookId);
    void deleteByBookId(String bookId);
}
