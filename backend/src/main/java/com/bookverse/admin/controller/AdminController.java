package com.bookverse.admin.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.user.model.AppUser;
import com.bookverse.user.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AppUserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public AdminController(AppUserRepository userRepository, BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long totalUsers = userRepository.count();
        long readers = userRepository.findAll().stream().filter(user -> "reader".equalsIgnoreCase(user.getRole())).count();
        long writers = userRepository.findAll().stream().filter(user -> "writer".equalsIgnoreCase(user.getRole())).count();
        int revenue = bookRepository.findAll().stream().filter(book -> book.getPrice() > 0).mapToInt(Book::getPrice).sum() * 8;

        return Map.of(
                "stats", List.of(
                        Map.of("title", "Total Users", "value", totalUsers),
                        Map.of("title", "Readers", "value", readers),
                        Map.of("title", "Writers", "value", writers),
                        Map.of("title", "Revenue", "value", "Rs " + revenue)
                ),
                "pendingBooks", bookRepository.findByApprovalStatus("PENDING")
        );
    }

    @GetMapping("/users")
    public List<AppUser> users() {
        return userRepository.findAll();
    }

    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<AppUser> banUser(@PathVariable String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setBanned(true);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/books")
    public List<Book> books() {
        return bookRepository.findAll();
    }

    @PatchMapping("/books/{id}/approval")
    public ResponseEntity<Book> updateApproval(@PathVariable String id, @RequestParam String status) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setApprovalStatus(status.toUpperCase());
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reviews")
    public List<Review> reviews() {
        return reviewRepository.findByReviewedFalse();
    }

    @PatchMapping("/reviews/{id}/reviewed")
    public ResponseEntity<Review> markReviewed(@PathVariable String id) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setReviewed(true);
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
