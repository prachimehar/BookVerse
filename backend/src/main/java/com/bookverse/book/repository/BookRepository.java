package com.bookverse.book.repository;

import com.bookverse.book.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByWriterId(String writerId);
    List<Book> findByApprovalStatus(String approvalStatus);
}
