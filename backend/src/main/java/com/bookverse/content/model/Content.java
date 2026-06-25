package com.bookverse.content.model;

import com.bookverse.shared.enums.ApprovalStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "content")
public class Content {
    @Id
    private String id;
    private String title;
    private String content;
    private ContentType type;
    private ContentVisibility visibility;
    private ApprovalStatus approvalStatus;
    private String authorId;
    private String authorName;
    private Instant createdAt;
    private Instant updatedAt;
}
