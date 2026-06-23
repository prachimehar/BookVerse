package com.bookverse.writer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "writers")
public class Writer {
    @Id
    private String id;
    private String name;
    private String avatar;
    private long followers;
    private String bio;
}
