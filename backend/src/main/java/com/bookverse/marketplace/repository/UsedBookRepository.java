package com.bookverse.marketplace.repository;

import com.bookverse.marketplace.model.UsedBook;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UsedBookRepository extends MongoRepository<UsedBook, String> {
    List<UsedBook> findByApprovedTrueAndSoldFalse();
    List<UsedBook> findBySellerId(String sellerId);
    List<UsedBook> findByApprovedFalse();
}
