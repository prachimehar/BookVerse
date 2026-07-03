package com.bookverse.review.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.security.BookVersePrincipal;
import com.bookverse.security.SecurityUtils;
import com.bookverse.shared.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;

    public ReviewController(
            ReviewRepository reviewRepository,
            BookRepository bookRepository,
            EmailService emailService) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.emailService = emailService;
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

        Review saved = reviewRepository.save(review);

        String bookTitle = bookRepository.findById(saved.getBookId())
                .map(Book::getTitle)
                .orElse("Unknown Book");

        emailService.notifyNewReviewPendingApproval(bookTitle, saved.getReviewer());

        return ResponseEntity.ok(saved);
    }

    // ---- TEMP: remove this after confirming emails work ----
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.notifyNewBookPendingApproval("Test Book", "Test Author");
        return "Email triggered";
    }
}