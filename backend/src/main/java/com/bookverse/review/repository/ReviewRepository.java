package com.bookverse.review.repository;

import com.bookverse.review.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByBookId(String bookId);
    List<Review> findByReviewedFalse();
    void deleteByBookId(String bookId);
}
