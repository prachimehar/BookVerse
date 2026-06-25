package com.bookverse.admin.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.content.model.Content;
import com.bookverse.content.model.ContentType;
import com.bookverse.content.model.ContentVisibility;
import com.bookverse.content.repository.ContentRepository;
import com.bookverse.marketplace.model.UsedBook;
import com.bookverse.marketplace.repository.UsedBookRepository;
import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.shared.enums.ApprovalStatus;
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
    private final UsedBookRepository usedBookRepository;
    private final ContentRepository contentRepository;

    public AdminController(AppUserRepository userRepository, BookRepository bookRepository, ReviewRepository reviewRepository, UsedBookRepository usedBookRepository, ContentRepository contentRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.usedBookRepository = usedBookRepository;
        this.contentRepository = contentRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long totalUsers = userRepository.count();
        List<AppUser> users = userRepository.findAll();
        long readers = users.stream().filter(user -> user.getRoles().stream().anyMatch("reader"::equalsIgnoreCase)).count();
        long writers = users.stream().filter(user -> user.getRoles().stream().anyMatch("writer"::equalsIgnoreCase)).count();
        int revenue = bookRepository.findAll().stream().filter(book -> book.getPrice() > 0).mapToInt(Book::getPrice).sum() * 8;

        return Map.of(
                "stats", List.of(
                        Map.of("title", "Total Users", "value", totalUsers),
                        Map.of("title", "Readers", "value", readers),
                        Map.of("title", "Writers", "value", writers),
                        Map.of("title", "Revenue", "value", "Rs " + revenue)
                ),
                "pendingBooks", bookRepository.findByApprovalStatus("PENDING"),
                "pendingWritings", pendingWritings()
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

    @PatchMapping("/users/{id}/roles")
    public ResponseEntity<AppUser> assignRole(@PathVariable String id, @RequestParam String role) {
        String normalizedRole = role.toLowerCase();
        if (!List.of("reader", "writer", "admin").contains(normalizedRole)) {
            return ResponseEntity.badRequest().build();
        }
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRoles().stream().noneMatch(normalizedRole::equalsIgnoreCase)) {
                        user.getRoles().add(normalizedRole);
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/books")
    public List<Book> books() {
        return bookRepository.findAll();
    }

    @PatchMapping("/books/{id}/approval")
    public ResponseEntity<Book> updateApproval(
            @PathVariable String id,
            @RequestParam String status) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setApprovalStatus(status.toUpperCase());
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/writing/pending")
    public List<Content> pendingWritings() {
        return contentRepository.findByApprovalStatusAndTypeInOrderByCreatedAtDesc(
                ApprovalStatus.PENDING,
                List.of(ContentType.POEM, ContentType.THOUGHT)
        );
    }

    @PatchMapping("/writing/{id}/approval")
    public ResponseEntity<Content> updateWritingApproval(
            @PathVariable String id,
            @RequestParam String status) {
        ApprovalStatus approvalStatus;
        try {
            approvalStatus = ApprovalStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().build();
        }

        if (!List.of(ApprovalStatus.APPROVED, ApprovalStatus.REJECTED).contains(approvalStatus)) {
            return ResponseEntity.badRequest().build();
        }

        return contentRepository.findById(id)
                .filter(writing -> List.of(ContentType.POEM, ContentType.THOUGHT).contains(writing.getType()))
                .filter(writing -> writing.getVisibility() == ContentVisibility.PUBLIC)
                .map(writing -> {
                    writing.setApprovalStatus(approvalStatus);
                    return ResponseEntity.ok(contentRepository.save(writing));
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

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> rejectReview(@PathVariable String id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/marketplace")
    public List<UsedBook> marketplaceListings() {
        return usedBookRepository.findByApprovedFalse();
    }

    @PatchMapping("/marketplace/{id}/approve")
    public ResponseEntity<UsedBook> approveMarketplaceListing(@PathVariable String id) {
        return usedBookRepository.findById(id)
                .map(listing -> {
                    listing.setApproved(true);
                    return ResponseEntity.ok(usedBookRepository.save(listing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/marketplace/{id}")
    public ResponseEntity<Void> rejectMarketplaceListing(@PathVariable String id) {
        if (!usedBookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        usedBookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
