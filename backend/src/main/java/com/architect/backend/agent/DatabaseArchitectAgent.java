package com.architect.backend.agent;

import org.springframework.stereotype.Component;

import com.architect.backend.service.GeminiService;

@Component
public class DatabaseArchitectAgent {

    private final GeminiService geminiService;

    public DatabaseArchitectAgent(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String design(String projectDescription, String expectedUsers) {
        String prompt = """
            You are a Senior Database Architect.

            A user wants to build the following software project:
            "%s"

            Expected scale: %s users.

            Provide:
            1. Three to five core database tables, each with 3-5 key columns
            2. The relationships between those tables (one-to-many, many-to-many, etc.)
            3. One indexing recommendation for performance

            Keep it concise, plain text, no markdown symbols.
            """.formatted(projectDescription, expectedUsers);

        return geminiService.generate(prompt);
    }
}