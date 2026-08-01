package com.architect.backend.agent;

import org.springframework.stereotype.Component;

import com.architect.backend.service.GeminiService;

@Component
public class SystemArchitectAgent {

    private final GeminiService geminiService;

    public SystemArchitectAgent(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String design(String projectDescription, String expectedUsers) {
        String prompt = """
            You are a Principal Software Architect.

            A user wants to build the following software project:
            "%s"

            Expected scale: %s users.

            Provide:
            1. Recommended architecture pattern (monolithic, microservices, or event-driven) with a one-sentence justification
            2. Three to five core services/modules this system needs, each with a one-line responsibility
            3. Two key REST API endpoints (method + path + purpose)

            Keep it concise, plain text, no markdown symbols.
            """.formatted(projectDescription, expectedUsers);

        return geminiService.generate(prompt);
    }
}