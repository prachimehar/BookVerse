package com.bookverse.library.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.library.model.LibraryItem;
import com.bookverse.library.repository.LibraryItemRepository;
import com.bookverse.security.SecurityUtils;

import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
    private final LibraryItemRepository libraryItemRepository;
    private final BookRepository bookRepository;

    public LibraryController(LibraryItemRepository libraryItemRepository, BookRepository bookRepository) {
        this.libraryItemRepository = libraryItemRepository;
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public List<Book> all() {
        String userId = SecurityUtils.currentUser().id();
        List<String> ids = libraryItemRepository.findByUserId(userId).stream()
                .map(LibraryItem::getBookId)
                .toList();
        return bookRepository.findAllById(ids);
    }

    @PostMapping("/{bookId}")
    public List<Book> add(@PathVariable String bookId) {
        String userId = SecurityUtils.currentUser().id();
        libraryItemRepository.findByUserIdAndBookId(userId, bookId).orElseGet(() -> {
            LibraryItem item = new LibraryItem();
            item.setUserId(userId);
            item.setBookId(bookId);
            item.setCreatedAt(Instant.now());
            return libraryItemRepository.save(item);
        });
        return all();
    }
}
