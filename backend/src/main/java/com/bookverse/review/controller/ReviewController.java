package com.bookverse.review.controller;

import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public List<Review> all(@RequestParam(required = false) String bookId) {
        if (bookId != null && !bookId.isBlank()) {
            return reviewRepository.findByBookId(bookId);
        }
        return reviewRepository.findAll();
    }
}
