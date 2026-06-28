package com.bookverse.content.repository;

import com.bookverse.content.model.Content;
import com.bookverse.content.model.ContentType;
import com.bookverse.content.model.ContentVisibility;
import com.bookverse.shared.enums.ApprovalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContentRepository extends MongoRepository<Content, String> {
    List<Content> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    List<Content> findByApprovalStatusAndTypeInOrderByCreatedAtDesc(ApprovalStatus approvalStatus, List<ContentType> types);

    List<Content> findByVisibilityAndApprovalStatusAndTypeInOrderByCreatedAtDesc(
            ContentVisibility visibility,
            ApprovalStatus approvalStatus,
            List<ContentType> types
    );
    boolean existsByAuthorIdAndTitleIgnoreCaseAndType(String authorId, String title, ContentType type);
}
