package com.bookverse.shared.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final String ADMIN_EMAIL = "adminbookverse@gmail.com";
    private static final String ADMIN_URL = "http://localhost:5173";

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void notifyNewBookPendingApproval(String bookTitle, String authorName) {
        send(
            "📚 New Book Pending Approval — " + bookTitle,
            "A new book has been submitted and is waiting for your approval.\n\n" +
            "Title:  " + bookTitle + "\n" +
            "Author: " + authorName + "\n\n" +
            "Please log in to the admin dashboard to review it.\n" +
            ADMIN_URL + "/admin/dashboard"
        );
    }

    @Async
    public void notifyBookUpdatedPendingApproval(String bookTitle, String authorName) {
        send(
            "📝 Book Updated — Re-approval Needed: " + bookTitle,
            "A writer has updated their book and it needs re-approval.\n\n" +
            "Title:  " + bookTitle + "\n" +
            "Author: " + authorName + "\n\n" +
            "Please log in to the admin dashboard to review it.\n" +
            ADMIN_URL + "/admin/dashboard"
        );
    }

    @Async
    public void notifyNewWritingPendingApproval(String title, String authorName, String type) {
        send(
            "✍️ New " + type + " Pending Approval",
            "A new " + type.toLowerCase() + " has been submitted for public visibility.\n\n" +
            "Title:  " + (title != null ? title : "Untitled") + "\n" +
            "Author: " + authorName + "\n\n" +
            "Please log in to the admin dashboard to review it.\n" +
            ADMIN_URL + "/admin/dashboard"
        );
    }

    @Async
    public void notifyNewReviewPendingApproval(String bookTitle, String reviewer) {
        send(
            "⭐ New Review Pending Moderation",
            "A new review has been submitted and needs moderation.\n\n" +
            "Book:     " + bookTitle + "\n" +
            "Reviewer: " + reviewer + "\n\n" +
            "Please log in to the admin dashboard to review it.\n" +
            ADMIN_URL + "/admin/dashboard"
        );
    }

    @Async
    public void notifyNewMarketplaceListingPendingApproval(String bookTitle, String sellerName) {
        send(
            "🛒 New Marketplace Listing Pending Approval",
            "A new used book listing has been submitted and needs approval.\n\n" +
            "Book:   " + bookTitle + "\n" +
            "Seller: " + sellerName + "\n\n" +
            "Please log in to the admin dashboard to review it.\n" +
            ADMIN_URL + "/admin/dashboard"
        );
    }

    private void send(String subject, String body) {
        System.out.println("📧 EMAIL TRIGGERED -> " + subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(ADMIN_EMAIL);
            message.setFrom(ADMIN_EMAIL);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}