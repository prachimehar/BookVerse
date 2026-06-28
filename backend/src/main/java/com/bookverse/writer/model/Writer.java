package com.bookverse.writer.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
    private List<String> followerIds = new ArrayList<>();

    public long getFollowers() {
        return followerIds == null ? 0 : followerIds.size();
    }
}
