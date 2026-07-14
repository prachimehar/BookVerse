
package com.bookverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.bookverse")
public class BookVerseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookVerseBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner debugMongoUri() {
        return args -> {
            String uri = System.getenv("MONGODB_URI");
            System.out.println("=== DEBUG: MONGODB_URI from env = [" + uri + "] ===");
        };
    }
}