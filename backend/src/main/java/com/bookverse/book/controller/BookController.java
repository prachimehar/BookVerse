package com.bookverse.book.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.model.Chapter;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.library.repository.LibraryItemRepository;
import com.bookverse.purchase.repository.PurchaseRepository;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.security.BookVersePrincipal;
import com.bookverse.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;
    private final LibraryItemRepository libraryItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final ReviewRepository reviewRepository;

    public BookController(
            BookRepository bookRepository,
            LibraryItemRepository libraryItemRepository,
            PurchaseRepository purchaseRepository,
            ReviewRepository reviewRepository) {

        this.bookRepository = bookRepository;
        this.libraryItemRepository = libraryItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.reviewRepository = reviewRepository;
    }

    // ---------------- GET ALL BOOKS ----------------
    @GetMapping
    public List<Book> all(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q) {

        return bookRepository.findAll().stream()

                // Only approved books
                .filter(book ->
                        "APPROVED".equalsIgnoreCase(
                                book.getApprovalStatus() == null ? "" : book.getApprovalStatus()
                        )
                )

                // Genre filter
                .filter(book -> {
                    if (genre == null || genre.isBlank() || genre.equalsIgnoreCase("All")) return true;

                    return book.getGenre() != null &&
                            book.getGenre().equalsIgnoreCase(genre.trim());
                })

                // Price filter
                .filter(book -> {
                    if (price == null || price.isBlank() || price.equalsIgnoreCase("all")) return true;
                    if (price.equalsIgnoreCase("free")) return book.getPrice() == 0;
                    if (price.equalsIgnoreCase("paid")) return book.getPrice() > 0;
                    return true;
                })

                // Search
                .filter(book ->
                        q == null || q.isBlank() || matchesSearch(book, q)
                )

                .sorted(sortComparator(sort))
                .toList();
    }

    // ---------------- GET CATEGORIES ----------------
@GetMapping("/categories")
public List<String> categories() {
    return bookRepository.findAll().stream()
            .map(Book::getGenre)
            .filter(g -> g != null && !g.isBlank())
            .distinct()
            .sorted()
            .toList();
}

    // ---------------- GET SINGLE BOOK ----------------
    @GetMapping("/{id}")
    public ResponseEntity<Book> one(@PathVariable String id) {

        String userId = currentUserIdOrNull();

        return bookRepository.findById(id)
                .map(book -> {

                    boolean purchased = userId != null &&
                            purchaseRepository.findByUserIdAndBookId(userId, id).isPresent();

                    // Full access if the book is free OR the reader has purchased it.
                    boolean fullAccess = book.getPrice() == 0 || purchased;

                    List<Chapter> chapters = book.getChapters().stream()
                            .map(ch -> {
                                boolean unlocked = fullAccess || ch.isUnlocked();
                                Chapter c = new Chapter();
                                c.setTitle(ch.getTitle());
                                c.setUnlocked(unlocked);
                                c.setContent(unlocked ? ch.getContent() : "");
                                return c;
                            })
                            .toList();

                    book.setChapters(chapters);

                    return ResponseEntity.ok(book);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- CREATE BOOK ----------------
    @PostMapping
    public Book create(@RequestBody Book book) {

        BookVersePrincipal principal = SecurityUtils.currentUser();

        validateBook(book);

        if (bookRepository.existsByWriterIdAndTitleIgnoreCase(principal.id(), book.getTitle().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You already have a book with this title");
        }

        Instant now = Instant.now();

        book.setId(null);
        book.setWriterId(principal.id());
        book.setAuthor(principal.name());
        book.setCreatedAt(now);
        book.setUpdatedAt(now);

        if (book.getStatus() == null)
            book.setStatus(book.getPrice() > 0 ? "PAID" : "FREE");

        // approvalStatus is NEVER taken from client input — always PENDING on create,
        // for both FREE and PAID books. Only admin endpoint can change this.
        book.setApprovalStatus("PENDING");

        if (book.getRating() == 0)
            book.setRating(4.5);

        if (book.getChapters() == null || book.getChapters().isEmpty())
            book.setChapters(List.of(new Chapter("Opening Chapter", true, "")));

        return bookRepository.save(book);
    }

    // ---------------- UPDATE BOOK ----------------
    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable String id, @RequestBody Book incoming) {

        BookVersePrincipal principal = SecurityUtils.currentUser();

        validateBook(incoming);

        return bookRepository.findById(id)
                .map(existing -> {

                    ensureCanModifyBook(existing, principal);

                    existing.setTitle(incoming.getTitle());
                    existing.setDescription(incoming.getDescription());
                    existing.setGenre(incoming.getGenre());
                    existing.setTags(incoming.getTags());
                    existing.setPrice(incoming.getPrice());

                    existing.setStatus(incoming.getPrice() > 0 ? "PAID" : "FREE");

                    // approvalStatus is NEVER taken from client input. Any edit by the
                    // writer resets it to PENDING so admin re-reviews. Admin can also
                    // edit, but should use the dedicated approve/reject endpoints instead.
                    if (!principal.roles().contains("ROLE_ADMIN")) {
                        existing.setApprovalStatus("PENDING");
                    }

                    existing.setUpdatedAt(Instant.now());

                    return ResponseEntity.ok(bookRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- DELETE BOOK ----------------
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable String id) {

        Book book = bookRepository.findById(id).orElse(null);

        if (book == null) return ResponseEntity.notFound().build();

        ensureCanModifyBook(book, SecurityUtils.currentUser());

        libraryItemRepository.deleteByBookId(id);
        purchaseRepository.deleteByBookId(id);
        reviewRepository.deleteByBookId(id);
        bookRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // ---------------- ADMIN: APPROVE BOOK ----------------
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Book> approve(@PathVariable String id) {

        BookVersePrincipal principal = SecurityUtils.currentUser();
        if (!principal.roles().contains("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        return bookRepository.findById(id)
                .map(book -> {
                    book.setApprovalStatus("APPROVED");
                    book.setUpdatedAt(Instant.now());
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- ADMIN: REJECT BOOK ----------------
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Book> reject(@PathVariable String id) {

        BookVersePrincipal principal = SecurityUtils.currentUser();
        if (!principal.roles().contains("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        return bookRepository.findById(id)
                .map(book -> {
                    book.setApprovalStatus("REJECTED");
                    book.setUpdatedAt(Instant.now());
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- WRITER BOOKS ----------------
    @GetMapping("/writer/books")
public List<Book> books() {
    return bookRepository.findByWriterId(SecurityUtils.currentUser().id());
}

// ---------------- TOGGLE LIKE ----------------
    @PostMapping("/{id}/like")
    public ResponseEntity<Book> toggleLike(@PathVariable String id) {

        String userId = SecurityUtils.currentUser().id();

        return bookRepository.findById(id)
                .map(book -> {

                    if (book.getLikedBy() == null) {
                        book.setLikedBy(new java.util.ArrayList<>());
                    }

                    if (book.getLikedBy().contains(userId)) {
                        book.getLikedBy().remove(userId);
                    } else {
                        book.getLikedBy().add(userId);
                    }

                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- HELPERS ----------------
    private void validateBook(Book book) {
        if (book.getTitle() == null || book.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title required");
        }
    }

    private void ensureCanModifyBook(Book book, BookVersePrincipal principal) {

        boolean isAdmin = principal.roles().contains("ROLE_ADMIN");
        if (isAdmin) return;

        boolean isWriter = principal.roles().contains("ROLE_WRITER");
        if (!isWriter) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Writer access required");
        }

        if (!book.getWriterId().equals(principal.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Cannot modify another writer's book");
        }
    }

    private boolean matchesSearch(Book book, String q) {
        String s = q.toLowerCase();
        return (book.getTitle() != null && book.getTitle().toLowerCase().contains(s)) ||
               (book.getAuthor() != null && book.getAuthor().toLowerCase().contains(s)) ||
               (book.getGenre() != null && book.getGenre().toLowerCase().contains(s));
    }

    private Comparator<Book> sortComparator(String sort) {
        if ("popular".equalsIgnoreCase(sort)) {
            return Comparator.comparing(Book::getFollowers).reversed();
        }
        if ("highestRated".equalsIgnoreCase(sort)) {
            return Comparator.comparing(Book::getRating).reversed();
        }
        return Comparator.comparing(Book::getCreatedAt).reversed();
    }

    private String currentUserIdOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof BookVersePrincipal p) {
            return p.id();
        }
        return null;
    }
}