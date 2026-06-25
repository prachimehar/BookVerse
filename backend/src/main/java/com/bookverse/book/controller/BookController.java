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
                            book.getApprovalStatus() == null
                                    ? ""
                                    : book.getApprovalStatus().trim()
                    )
            )

            // Genre filter
            .filter(book -> {
                if (genre == null || genre.isBlank() || genre.equalsIgnoreCase("All")) {
                    return true;
                }

                String selectedGenre = genre.trim().toLowerCase();
                String bookGenre = book.getGenre() == null
                        ? ""
                        : book.getGenre().trim().toLowerCase();

                return selectedGenre.equals(bookGenre);
            })

            // Price filter
            .filter(book -> {
                if (price == null || price.isBlank() || price.equalsIgnoreCase("all")) {
                    return true;
                }

                if (price.equalsIgnoreCase("free")) {
                    return book.getPrice() == 0;
                }

                if (price.equalsIgnoreCase("paid")) {
                    return book.getPrice() > 0;
                }

                return true;
            })

            // Search filter
            .filter(book ->
                    q == null ||
                    q.isBlank() ||
                    matchesSearch(book, q)
            )

            // Sorting
            .sorted(sortComparator(sort))

            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> one(@PathVariable String id) {
        String userId = currentUserIdOrNull();

        return bookRepository.findById(id)
                .map(book -> {

                    boolean purchased = userId != null && purchaseRepository
                            .findByUserIdAndBookId(userId, book.getId())
                            .isPresent();

                    if (book.getPrice() > 0 && !purchased) {

                        List<Chapter> preview = book.getChapters()
                                .stream()
                                .map(ch -> {

                                    Chapter c = new Chapter();

                                    c.setTitle(ch.getTitle());

                                    c.setUnlocked(
                                            ch.isUnlocked());

                                    c.setContent(

                                            ch.isUnlocked()

                                                    ? ch.getContent()

                                                    : ""

                                );

                                    return c;

                                })
                                .toList();

                        book.setChapters(preview);

                    }

                    return ResponseEntity.ok(book);

                })

                .orElse(

                        ResponseEntity.notFound().build()

                );

    }

    @PostMapping
    public Book create(@RequestBody Book book) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        validateBook(book);
        Instant now = Instant.now();
        book.setId(null);
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        book.setWriterId(principal.id());
        book.setAuthor(principal.name());
        if (book.getStatus() == null || book.getStatus().isBlank()) {
            book.setStatus(book.getPrice() > 0 ? "PAID" : "FREE");
        }
        if (book.getApprovalStatus() == null || book.getApprovalStatus().isBlank()) {
            book.setApprovalStatus(book.getPrice() > 0 ? "PENDING" : "APPROVED");
        }
        if (book.getRating() == 0) {
            book.setRating(4.5);
        }
        if (book.getCover() == null || book.getCover().isBlank()) {
            book.setCover(
                    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80");
        }
        if (book.getChapters() == null || book.getChapters().isEmpty()) {
            book.setChapters(List.of(new Chapter("Opening Chapter", true, "")));
        }
        return bookRepository.save(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(
            @PathVariable String id,
            @RequestBody Book incoming) {
        validateBook(incoming);
        BookVersePrincipal principal = SecurityUtils.currentUser();
        return bookRepository.findById(id)
                .map(existing -> {
                    ensureCanModifyBook(existing, principal);
                    existing.setTitle(incoming.getTitle());
                    existing.setDescription(incoming.getDescription());
                    existing.setGenre(incoming.getGenre());
                    existing.setTags(incoming.getTags());
                    existing.setPrice(incoming.getPrice());
                    existing.setStatus(incoming.getPrice() > 0 ? "PAID" : "FREE");
                    existing.setApprovalStatus(incoming.getPrice() > 0 ? "PENDING" : "APPROVED");
                    existing.setCover(incoming.getCover() == null || incoming.getCover().isBlank() ? existing.getCover()
                            : incoming.getCover());
                    existing.setChapters(
                            incoming.getChapters() == null || incoming.getChapters().isEmpty() ? existing.getChapters()
                                    : incoming.getChapters());
                    existing.setUpdatedAt(Instant.now());
                    return ResponseEntity.ok(bookRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable String id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        ensureCanModifyBook(book, SecurityUtils.currentUser());

        libraryItemRepository.deleteByBookId(id);
        purchaseRepository.deleteByBookId(id);
        reviewRepository.deleteByBookId(id);
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
public List<String> categories() {
    return bookRepository.findAll().stream()
            .map(Book::getGenre)
            .filter(genre -> genre != null && !genre.isBlank())
            .map(String::trim)
            .collect(Collectors.toMap(
                    String::toLowerCase,
                    g -> g,
                    (a, b) -> a
            ))
            .values()
            .stream()
            .sorted()
            .toList();
}

    private boolean matchesSearch(Book book, String query) {
        String needle = query.toLowerCase(Locale.ROOT);
        return contains(book.getTitle(), needle)
                || contains(book.getAuthor(), needle)
                || contains(book.getGenre(), needle)
                || book.getTags().stream().anyMatch(tag -> contains(tag, needle));
    }

    private boolean contains(String value, String needle) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(needle);
    }

    private Comparator<Book> sortComparator(String sort) {
        if ("highestRated".equalsIgnoreCase(sort)) {
            return Comparator.comparing(Book::getRating).reversed();
        }
        if ("popular".equalsIgnoreCase(sort)) {
            return Comparator.comparing(Book::getFollowers).reversed();
        }
        return Comparator.comparing(Book::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed();
    }

    private void validateBook(Book book) {
        if (book.getTitle() == null || book.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Book title is required");
        }
    }

    private void ensureCanModifyBook(Book book, BookVersePrincipal principal) {
        if (principal.roles().stream().anyMatch("admin"::equalsIgnoreCase)) {
            return;
        }

        if (book.getWriterId() == null || !book.getWriterId().equals(principal.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot modify another writer's book");
        }
    }

    private String currentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof BookVersePrincipal principal) {
            return principal.id();
        }
        return null;
    }
}
