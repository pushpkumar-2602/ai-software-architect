package com.architect.backend.agent;

import org.springframework.stereotype.Component;

import com.architect.backend.service.GeminiService;

@Component
public class DiagramAgent {

    private final GeminiService geminiService;

    public DiagramAgent(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String generateDiagram(String diagramType, String mermaidSyntaxGuide,
                                    String projectDescription, String expectedUsers) {
        String prompt = """
            You are a software architect creating a %s for the following project:
            "%s"

            Expected scale: %s users.

            Generate this diagram using Mermaid.js syntax.
            %s

            CRITICAL RULES:
            - Respond with ONLY the Mermaid code, nothing else
            - No markdown code fences (no ```mermaid or ```)
            - No explanation before or after
            - Make it specific to THIS project (use real entity/actor names relevant to it, not generic placeholders)
            - Keep it readable: 5-12 nodes/entities maximum
            """.formatted(diagramType, projectDescription, expectedUsers, mermaidSyntaxGuide);

        String result = geminiService.generate(prompt);

        // Clean up in case Gemini adds fences anyway
        return result
                .replaceAll("(?s)```mermaid\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();
    }
}