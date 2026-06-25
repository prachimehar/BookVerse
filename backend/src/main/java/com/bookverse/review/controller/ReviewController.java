package com.bookverse.review.controller;

import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.security.BookVersePrincipal;
import com.bookverse.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
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
            return reviewRepository.findByBookIdAndReviewedTrue(bookId);
        }
        return reviewRepository.findByReviewedFalse();
    }

    @PostMapping
    public ResponseEntity<Review> create(@RequestBody Review review) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        review.setId(null);
        review.setReviewer(principal.name());
        review.setReviewed(false);
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
