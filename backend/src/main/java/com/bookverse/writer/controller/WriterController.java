package com.bookverse.writer.controller;

import com.bookverse.writer.model.Writer;
import com.bookverse.writer.repository.WriterRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/writers")
public class WriterController {
    private final WriterRepository writerRepository;

    public WriterController(WriterRepository writerRepository) {
        this.writerRepository = writerRepository;
    }

    @GetMapping
    public List<Writer> all() {
        return writerRepository.findAll().stream()
                .sorted(Comparator.comparing(Writer::getFollowers).reversed())
                .toList();
    }
}
