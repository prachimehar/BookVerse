package com.bookverse.purchase.controller;

import com.bookverse.book.model.Book;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.purchase.model.Purchase;
import com.bookverse.purchase.repository.PurchaseRepository;
import com.bookverse.security.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {
    private final PurchaseRepository purchaseRepository;
    private final BookRepository bookRepository;

    public PurchaseController(PurchaseRepository purchaseRepository, BookRepository bookRepository) {
        this.purchaseRepository = purchaseRepository;
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public List<Book> all() {
        List<String> ids = purchaseRepository.findByUserId(SecurityUtils.currentUser().id()).stream()
                .map(Purchase::getBookId)
                .toList();
        return ids.isEmpty() ? List.of() : bookRepository.findAllById(ids);
    }

    @GetMapping("/check/{bookId}")
    public boolean hasPurchased(@PathVariable String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        return book.getPrice() == 0 || purchaseRepository
                .findByUserIdAndBookId(SecurityUtils.currentUser().id(), bookId)
                .isPresent();
    }

    @PostMapping("/{bookId}")
    public List<Book> buy(@PathVariable String bookId) {
        String userId = SecurityUtils.currentUser().id();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (book.getPrice() > 0) {
            purchaseRepository.findByUserIdAndBookId(userId, bookId).orElseGet(() -> {
                Purchase purchase = new Purchase();
                purchase.setUserId(userId);
                purchase.setBookId(bookId);
                purchase.setAmount(book.getPrice());
                purchase.setPurchasedAt(Instant.now());
                return purchaseRepository.save(purchase);
            });
        }

        return all();
    }
}
