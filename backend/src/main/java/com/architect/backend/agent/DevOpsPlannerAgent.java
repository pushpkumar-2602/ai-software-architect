package com.architect.backend.agent;

import org.springframework.stereotype.Component;

import com.architect.backend.service.GeminiService;

@Component
public class DevOpsPlannerAgent {

    private final GeminiService geminiService;

    public DevOpsPlannerAgent(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String plan(String projectDescription, String expectedUsers) {
        String prompt = """
            You are a DevOps Lead and QA Manager.

            A user wants to build the following software project:
            "%s"

            Expected scale: %s users.

            Provide:
            1. Three important test cases (type + short description)
            2. Two security risks to watch for, with a mitigation for each
            3. A rough estimated build timeline in weeks

            Keep it concise, plain text, no markdown symbols.
            """.formatted(projectDescription, expectedUsers);

        return geminiService.generate(prompt);
    }
}