package com.bookverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.bookverse")
public class BookVerseBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookVerseBackendApplication.class, args);
    }
}
