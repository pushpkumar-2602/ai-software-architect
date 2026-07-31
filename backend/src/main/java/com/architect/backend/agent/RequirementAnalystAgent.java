package com.architect.backend.agent;

import org.springframework.stereotype.Component;

import com.architect.backend.service.GeminiService;

@Component
public class RequirementAnalystAgent {

    private final GeminiService geminiService;

    public RequirementAnalystAgent(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String analyze(String projectDescription, String expectedUsers) {
        String prompt = """
            You are a Senior Requirements Analyst with 20 years of experience.

            A user wants to build the following software project:
            "%s"

            Expected scale: %s users.

            List:
            1. Five functional requirements (numbered)
            2. Three non-functional requirements (numbered)

            Keep it concise and clearly formatted with plain text, no markdown symbols.
            """.formatted(projectDescription, expectedUsers);

        return geminiService.generate(prompt);
    }
}