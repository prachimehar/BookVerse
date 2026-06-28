package com.bookverse.content.controller;

import com.bookverse.content.model.Content;
import com.bookverse.content.model.ContentType;
import com.bookverse.content.model.ContentVisibility;
import com.bookverse.content.repository.ContentRepository;
import com.bookverse.security.BookVersePrincipal;
import com.bookverse.security.SecurityUtils;
import com.bookverse.shared.enums.ApprovalStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/writing")
public class WritingController {
    private static final List<ContentType> WRITING_TYPES = List.of(ContentType.POEM, ContentType.THOUGHT);

    private final ContentRepository contentRepository;

    public WritingController(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @PostMapping
    public Content createWriting(@RequestBody Content incoming) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        validateWriting(incoming);

        String title = normalizeBlank(incoming.getTitle());

        // Only block duplicates when a title is actually given —
        // untitled writings are allowed to repeat.
        if (title != null &&
                contentRepository.existsByAuthorIdAndTitleIgnoreCaseAndType(principal.id(), title, incoming.getType())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You already have a " + incoming.getType().name().toLowerCase() + " with this title");
        }

        Instant now = Instant.now();
        Content writing = new Content();
        writing.setTitle(title);
        writing.setContent(incoming.getContent().trim());
        writing.setType(incoming.getType());
        writing.setVisibility(incoming.getVisibility() == null ? ContentVisibility.PRIVATE : incoming.getVisibility());
        writing.setApprovalStatus(approvalFor(writing.getVisibility()));
        writing.setAuthorId(principal.id());
        writing.setAuthorName(principal.name());
        writing.setCreatedAt(now);
        writing.setUpdatedAt(now);

        return contentRepository.save(writing);
    }

    @GetMapping("/my")
    public List<Content> myWritings() {
        return contentRepository.findByAuthorIdOrderByCreatedAtDesc(SecurityUtils.currentUser().id()).stream()
                .filter(writing -> WRITING_TYPES.contains(writing.getType()))
                .toList();
    }

    @GetMapping("/public")
    public List<Content> publicWritings(@RequestParam(required = false) ContentType type) {
        List<ContentType> types = type == null ? WRITING_TYPES : List.of(type);
        if (types.stream().anyMatch(value -> !WRITING_TYPES.contains(value))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Writing type must be POEM or THOUGHT");
        }

        return contentRepository.findByVisibilityAndApprovalStatusAndTypeInOrderByCreatedAtDesc(
                ContentVisibility.PUBLIC,
                ApprovalStatus.APPROVED,
                types
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Content> one(@PathVariable String id) {
        BookVersePrincipal principal = SecurityUtils.currentUser();

        return contentRepository.findById(id)
                .map(writing -> {
                    ensureWritingType(writing);
                    if (!canView(writing, principal)) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this writing");
                    }
                    return ResponseEntity.ok(writing);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Content> update(@PathVariable String id, @RequestBody Content incoming) {
        BookVersePrincipal principal = SecurityUtils.currentUser();
        validateWriting(incoming);

        return contentRepository.findById(id)
                .map(existing -> {
                    ensureCanManage(existing, principal);
                    existing.setTitle(normalizeBlank(incoming.getTitle()));
                    existing.setContent(incoming.getContent().trim());
                    existing.setType(incoming.getType());
                    existing.setVisibility(incoming.getVisibility() == null ? ContentVisibility.PRIVATE : incoming.getVisibility());
                    existing.setApprovalStatus(approvalFor(existing.getVisibility()));
                    existing.setUpdatedAt(Instant.now());
                    return ResponseEntity.ok(contentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        BookVersePrincipal principal = SecurityUtils.currentUser();

        return contentRepository.findById(id)
                .map(existing -> {
                    ensureCanManage(existing, principal);
                    contentRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void validateWriting(Content writing) {
        if (writing.getContent() == null || writing.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Writing content is required");
        }

        if (writing.getType() == null || !WRITING_TYPES.contains(writing.getType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Writing type must be POEM or THOUGHT");
        }
    }

    private ApprovalStatus approvalFor(ContentVisibility visibility) {
        return visibility == ContentVisibility.PUBLIC ? ApprovalStatus.PENDING : ApprovalStatus.NOT_REQUIRED;
    }

    private String normalizeBlank(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private boolean canView(Content writing, BookVersePrincipal principal) {
        return isOwner(writing, principal)
                || isAdmin(principal)
                || (writing.getVisibility() == ContentVisibility.PUBLIC
                && writing.getApprovalStatus() == ApprovalStatus.APPROVED);
    }

    private void ensureCanManage(Content writing, BookVersePrincipal principal) {
        ensureWritingType(writing);
        if (!isOwner(writing, principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot manage another writer's writing");
        }
    }

    private void ensureWritingType(Content writing) {
        if (!WRITING_TYPES.contains(writing.getType())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Writing not found");
        }
    }

    private boolean isOwner(Content writing, BookVersePrincipal principal) {
        return writing.getAuthorId() != null && writing.getAuthorId().equals(principal.id());
    }

    private boolean isAdmin(BookVersePrincipal principal) {
        return principal.roles().stream().anyMatch("admin"::equalsIgnoreCase);
    }
}
