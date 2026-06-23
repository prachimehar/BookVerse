package com.bookverse.purchase.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.purchase.model.Purchase;
import com.bookverse.purchase.repository.PurchaseRepository;
import org.springframework.web.bind.annotation.*;
import com.bookverse.user.Context.*;

import java.time.Instant;
import java.util.List;
@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final BookRepository bookRepository;

    public PurchaseController(PurchaseRepository purchaseRepository,
                              BookRepository bookRepository) {
        this.purchaseRepository = purchaseRepository;
        this.bookRepository = bookRepository;
    }

    // Get purchased books (ONLY paid purchases)
    @GetMapping
    public List<Book> all() {

        List<String> ids = purchaseRepository
                .findByUserId(UserContext.DEMO_USER_ID)
                .stream()
                .map(Purchase::getBookId)
                .toList();

        if (ids.isEmpty()) {
            return List.of();
        }

        return bookRepository.findAllById(ids);
    }

    // FIXED: FREE books are always accessible
    @GetMapping("/check/{bookId}")
    public boolean hasPurchased(@PathVariable String bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        // ✅ FREE books are ALWAYS accessible
        if (book.getPrice() == 0) {
            return true;
        }

        // Paid books require purchase check
        return purchaseRepository
                .findByUserIdAndBookId(UserContext.DEMO_USER_ID, bookId)
                .isPresent();
    }

    // BUY book (only for PAID books)
    @PostMapping("/{bookId}")
    public List<Book> buy(@PathVariable String bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        // ❌ prevent buying free books
        if (book.getPrice() == 0) {
            return all();
        }

        purchaseRepository.findByUserIdAndBookId(UserContext.DEMO_USER_ID, bookId)
                .orElseGet(() -> {
                    Purchase purchase = new Purchase();
                    purchase.setUserId(UserContext.DEMO_USER_ID);
                    purchase.setBookId(bookId);
                    purchase.setAmount(book.getPrice());
                    purchase.setPurchasedAt(Instant.now());
                    return purchaseRepository.save(purchase);
                });

        return all();
    }
}