package com.bookverse.payment.controller;

import com.bookverse.purchase.model.Purchase;
import com.bookverse.purchase.repository.PurchaseRepository;
import com.bookverse.user.Context.UserContext;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PurchaseRepository purchaseRepository;


    public PaymentController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody PaymentDto dto) {

        boolean alreadyPurchased =
                purchaseRepository
                        .findByUserIdAndBookId(UserContext.DEMO_USER_ID, dto.getBookId())
                        .isPresent();

        if (!alreadyPurchased) {

            Purchase purchase = new Purchase();

            purchase.setBookId(dto.getBookId());
            purchase.setUserId(UserContext.DEMO_USER_ID);
            purchase.setPurchasedAt(Instant.now());

            purchaseRepository.save(purchase);
        }

        return ResponseEntity.ok().build();
    }


    private static class PaymentDto {

        private String bookId;

        public String getBookId() {
            return bookId;
        }

        // public void setBookId(String bookId) {
        //     this.bookId = bookId;
        // }
    }
}