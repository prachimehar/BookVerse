package com.bookverse.writer.repository;

import com.bookverse.writer.model.Writer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WriterRepository extends MongoRepository<Writer, String> {
}
