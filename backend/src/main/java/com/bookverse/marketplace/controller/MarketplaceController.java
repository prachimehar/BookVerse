package com.bookverse.marketplace.controller;

import com.bookverse.marketplace.model.UsedBook;
import com.bookverse.marketplace.repository.UsedBookRepository;
import com.bookverse.security.BookVersePrincipal;
import com.bookverse.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
public class MarketplaceController {
    private final UsedBookRepository usedBookRepository;

    public MarketplaceController(UsedBookRepository usedBookRepository) {
        this.usedBookRepository = usedBookRepository;
    }

    @GetMapping
    public List<UsedBook> all() {
        return usedBookRepository.findByApprovedTrueAndSoldFalse().stream()
                .sorted(Comparator.comparing(UsedBook::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsedBook> details(@PathVariable String id) {
        return usedBookRepository.findById(id)
                .filter(listing -> listing.isApproved() && !listing.isSold())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsedBook> create(@RequestBody UsedBook usedBook) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        usedBook.setId(null);
        usedBook.setSellerId(principal.id());
        if (usedBook.getSellerName() == null || usedBook.getSellerName().isBlank()) {
            usedBook.setSellerName(principal.name());
        }
        usedBook.setApproved(false);
        usedBook.setSold(false);
        usedBook.setCreatedAt(Instant.now());
        return ResponseEntity.ok(usedBookRepository.save(usedBook));
    }

    @GetMapping("/mine")
    public List<UsedBook> mine() {
        return usedBookRepository.findBySellerId(SecurityUtils.currentUser().id()).stream()
                .sorted(Comparator.comparing(UsedBook::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<UsedBook> markSold(@PathVariable String id) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        return usedBookRepository.findById(id)
                .map(listing -> {
                    if (!canModify(listing, principal)) {
                        return ResponseEntity.status(403).<UsedBook>build();
                    }
                    listing.setSold(true);
                    return ResponseEntity.ok(usedBookRepository.save(listing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        UsedBook listing = usedBookRepository.findById(id).orElse(null);
        if (listing == null) {
            return ResponseEntity.notFound().build();
        }
        if (!canModify(listing, SecurityUtils.currentUser())) {
            return ResponseEntity.status(403).build();
        }

        usedBookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean canModify(UsedBook listing, BookVersePrincipal principal) {
        return principal.roles().stream().anyMatch("admin"::equalsIgnoreCase) || principal.id().equals(listing.getSellerId());
    }
}
