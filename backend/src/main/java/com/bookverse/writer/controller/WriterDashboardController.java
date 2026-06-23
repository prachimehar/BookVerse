package com.bookverse.writer.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/writer")
public class WriterDashboardController {
    private static final String DEMO_WRITER_ID = "writer-1";

    private final BookRepository bookRepository;

    public WriterDashboardController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping("/books")
    public List<Book> books() {
        return bookRepository.findByWriterId(DEMO_WRITER_ID);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        List<Book> books = books();
        int revenue = books.stream().mapToInt(Book::getPrice).sum() * 24;
        long followers = books.stream().mapToLong(Book::getFollowers).sum();

        return Map.of(
                "stats", List.of(
                        Map.of("title", "Books Published", "value", books.size()),
                        Map.of("title", "Followers", "value", followers),
                        Map.of("title", "Revenue", "value", "Rs " + revenue),
                        Map.of("title", "Books Sold", "value", books.stream().filter(book -> book.getPrice() > 0).count() * 560)
                ),
                "recentBooks", books.stream()
                        .sorted(Comparator.comparing(Book::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                        .limit(3)
                        .toList(),
                "pendingBooks", books.stream()
                        .filter(book -> !"APPROVED".equalsIgnoreCase(book.getApprovalStatus()))
                        .toList()
        );
    }
}
