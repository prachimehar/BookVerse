package com.bookverse.config.seed;

import com.bookverse.book.model.Book;
import com.bookverse.book.model.Chapter;
import com.bookverse.book.repository.BookRepository;
import com.bookverse.library.model.LibraryItem;
import com.bookverse.library.repository.LibraryItemRepository;
import com.bookverse.purchase.model.Purchase;
import com.bookverse.purchase.repository.PurchaseRepository;
import com.bookverse.review.model.Review;
import com.bookverse.review.repository.ReviewRepository;
import com.bookverse.user.model.AppUser;
import com.bookverse.user.repository.AppUserRepository;
import com.bookverse.writer.model.Writer;
import com.bookverse.writer.repository.WriterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final BookRepository bookRepository;
    private final WriterRepository writerRepository;
    private final ReviewRepository reviewRepository;
    private final AppUserRepository userRepository;
    private final LibraryItemRepository libraryItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            BookRepository bookRepository,
            WriterRepository writerRepository,
            ReviewRepository reviewRepository,
            AppUserRepository userRepository,
            LibraryItemRepository libraryItemRepository,
            PurchaseRepository purchaseRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.bookRepository = bookRepository;
        this.writerRepository = writerRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.libraryItemRepository = libraryItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();

        if (writerRepository.count() == 0) {
            seedWriters();
        }

        if (bookRepository.count() == 0) {
            seedBooks();
        }

        if (reviewRepository.count() == 0) {
            seedReviews();
        }

        if (libraryItemRepository.count() == 0) {
            seedLibraryItems();
        }

        if (purchaseRepository.count() == 0) {
            seedPurchases();
        }
    }

    private void seedUsers() {
        List.of(
                user("user-reader", "BookVerse Guest", "reader@bookverse.app", List.of("reader"), false),
                user("user-writer", "BookVerse Writer", "writer@bookverse.app", List.of("reader", "writer"), false),
                user("user-admin", "BookVerse Admin", "admin@bookverse.app", List.of("admin"), false),
                user("user-nina", "Nina Hart", "nina@example.com", List.of("reader", "writer"), false),
                user("user-jason", "Jason Cole", "jason@example.com", List.of("reader", "writer"), false),
                user("user-maya", "Maya Liu", "maya@example.com", List.of("reader"), false)
        ).forEach(this::upsertSeedUser);
    }

    private void upsertSeedUser(AppUser seedUser) {
        AppUser user = userRepository.findByEmail(seedUser.getEmail()).orElse(seedUser);
        if (user.getId() == null || user.getId().isBlank()) {
            user.setId(seedUser.getId());
        }
        user.setName(seedUser.getName());
        user.setEmail(seedUser.getEmail());
        user.setRoles(seedUser.getRoles());
        user.setPasswordHash(seedUser.getPasswordHash());
        user.setBanned(seedUser.isBanned());
        user.setAvatar(seedUser.getAvatar());
        user.setProvider("local");
        userRepository.save(user);
    }

    private void seedWriters() {
        writerRepository.saveAll(List.of(
                writer("writer-1", "Nina Hart", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", 23400, "Fantasy author with a taste for immersive worlds and poetic characters."),
                writer("writer-2", "Jason Cole", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", 18900, "Mystery storyteller who blends suspense with emotional depth."),
                writer("writer-3", "Maya Liu", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", 27600, "Science fiction creator focused on lyrical futures and bold ideas."),
                writer("writer-4", "Aria Bennett", "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=200&q=80", 14200, "Romance writer capturing tender moments and honest relationships.")
        ));
    }

    private void seedBooks() {
        Instant now = Instant.now();
        bookRepository.saveAll(List.of(
                book("book-1", "The Violet Library", "Nina Hart", "writer-1", "Fantasy", 4.9, 0, "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80", "A luminous tale about a library that holds every story ever written, where readers discover the books that change them.", List.of("magic", "literary", "adventure"), 12400, "FREE", "APPROVED", now.minusSeconds(5000), List.of("A Quiet Invitation", "The Reading Room", "Ink in the Moonlight")),
                book("book-2", "Midnight Manuscript", "Jason Cole", "writer-2", "Mystery", 4.7, 199, "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80", "A writer races to finish a lost manuscript while the city around him pulses with suspense and secrets.", List.of("thriller", "noir", "suspense"), 8700, "PAID", "PENDING", now.minusSeconds(4000), List.of("The Last Page", "Footsteps in Fog", "Typewriter Confessions")),
                book("book-3", "Paper Cities", "Maya Liu", "writer-3", "Sci-Fi", 4.8, 0, "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", "A richly imagined future where readers travel between paper cities, chasing stories that blur the line between reality and wonder.", List.of("science fiction", "worldbuilding", "dreamy"), 15700, "FREE", "APPROVED", now.minusSeconds(3000), List.of("Map of the Unknown", "Skyline of Stories", "The Library Gate")),
                book("book-4", "Season of Quiet Pages", "Aria Bennett", "writer-4", "Romance", 4.6, 149, "https://images.unsplash.com/photo-1496104679561-38b3e7f1f5b0?auto=format&fit=crop&w=600&q=80", "An intimate love story told in letters, coffee shop evenings, and quiet pages that capture a year of change.", List.of("romance", "slow burn", "contemporary"), 9600, "PAID", "PENDING", now.minusSeconds(2000), List.of("Letters on the Window", "An Afternoon at Birch", "Winter Pages")),
                book("book-5", "The Archive of Stars", "Noah Reed", "writer-1", "History", 4.5, 0, "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80", "A poetic nonfiction voyage through the people, places, and ideas that shaped a century of stories.", List.of("history", "biography", "poetry"), 11200, "FREE", "APPROVED", now.minusSeconds(1000), List.of("First Edition", "Golden Trails", "After the Ink"))
        ));
    }

    private void seedReviews() {
        reviewRepository.saveAll(List.of(
                review("review-1", "book-1", "Zara M.", "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80", 5, "BookVerse feels polished, immersive, and effortless. The detail in every page is outstanding.", false),
                review("review-2", "book-1", "Leo P.", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", 4, "A premium reader experience with powerful discovery tools and elegant design.", false),
                review("review-3", "book-3", "Anika S.", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", 4.5, "I love the modern tone and smooth interactions. Great for readers and writers alike.", false)
        ));
    }

    private void seedLibraryItems() {
        libraryItemRepository.saveAll(List.of(libraryItem("book-1"), libraryItem("book-3"), libraryItem("book-5")));
    }

    private void seedPurchases() {
        purchaseRepository.saveAll(List.of(purchase("book-2", 199), purchase("book-4", 149)));
    }

    private AppUser user(String id, String name, String email, List<String> roles, boolean banned) {
        AppUser user = new AppUser();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setRoles(roles);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setBanned(banned);
        user.setAvatar("https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80");
        return user;
    }

    private Writer writer(String id, String name, String avatar, long followers, String bio) {
        Writer writer = new Writer();
        writer.setId(id);
        writer.setName(name);
        writer.setAvatar(avatar);
        writer.setFollowers(followers);
        writer.setBio(bio);
        return writer;
    }

    private Book book(String id, String title, String author, String writerId, String genre, double rating, int price, String cover, String description, List<String> tags, long followers, String status, String approvalStatus, Instant createdAt, List<String> chapterTitles) {
        Book book = new Book();
        book.setId(id);
        book.setTitle(title);
        book.setAuthor(author);
        book.setWriterId(writerId);
        book.setGenre(genre);
        book.setRating(rating);
        book.setPrice(price);
        book.setCover(cover);
        book.setDescription(description);
        book.setTags(tags);
        book.setFollowers(followers);
        book.setStatus(status);
        book.setApprovalStatus(approvalStatus);
        book.setCreatedAt(createdAt);
        book.setUpdatedAt(createdAt);
        book.setChapters(chapterTitles.stream()
                .map(titleValue -> new Chapter(titleValue, chapterTitles.indexOf(titleValue) == 0, ""))
                .toList());
        return book;
    }

    private Review review(String id, String bookId, String reviewer, String avatar, double rating, String comment, boolean reviewed) {
        Review review = new Review();
        review.setId(id);
        review.setBookId(bookId);
        review.setReviewer(reviewer);
        review.setAvatar(avatar);
        review.setRating(rating);
        review.setComment(comment);
        review.setReviewed(reviewed);
        return review;
    }

    private LibraryItem libraryItem(String bookId) {
        LibraryItem item = new LibraryItem();
        item.setUserId("user-reader");
        item.setBookId(bookId);
        item.setCreatedAt(Instant.now());
        return item;
    }

    private Purchase purchase(String bookId, int amount) {
        Purchase purchase = new Purchase();
        purchase.setUserId("user-reader");
        purchase.setBookId(bookId);
        purchase.setAmount(amount);
        purchase.setPurchasedAt(Instant.now());
        return purchase;
    }
}
