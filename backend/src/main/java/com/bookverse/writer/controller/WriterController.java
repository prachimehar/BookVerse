package com.bookverse.writer.controller;

import com.bookverse.writer.model.Writer;
import com.bookverse.writer.repository.WriterRepository;
import com.bookverse.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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


    @PostMapping("/{id}/follow")
    public ResponseEntity<Writer> toggleFollow(@PathVariable String id) {

        String userId = SecurityUtils.currentUser().id();

        if (id.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot follow yourself");
        }

        return writerRepository.findById(id)
                .map(writer -> {

                    if (writer.getFollowerIds() == null) {
                        writer.setFollowerIds(new java.util.ArrayList<>());
                    }

                    if (writer.getFollowerIds().contains(userId)) {
                        writer.getFollowerIds().remove(userId);
                    } else {
                        writer.getFollowerIds().add(userId);
                    }

                    return ResponseEntity.ok(writerRepository.save(writer));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
