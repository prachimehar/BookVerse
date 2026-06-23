package com.bookverse.library.repository;

import com.bookverse.library.model.LibraryItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LibraryItemRepository extends MongoRepository<LibraryItem, String> {
    List<LibraryItem> findByUserId(String userId);
    Optional<LibraryItem> findByUserIdAndBookId(String userId, String bookId);
    void deleteByBookId(String bookId);
}
