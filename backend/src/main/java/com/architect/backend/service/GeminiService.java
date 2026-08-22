package com.architect.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;

    public GeminiService(@Value("${gemini.api-key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent")
                .build();
    }

       public String generate(String prompt) {
        int maxRetries = 3;
        int waitSeconds = 2;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                Map<String, Object> requestBody = Map.of(
                        "contents", List.of(
                                Map.of("parts", List.of(
                                        Map.of("text", prompt)
                                ))
                        )
                );

                Map response = webClient.post()
                        .uri("?key=" + apiKey)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                return extractText(response);

            } catch (org.springframework.web.reactive.function.client.WebClientResponseException.TooManyRequests e) {
                if (attempt == maxRetries) {
                    throw new RuntimeException(
                        "Gemini rate limit exceeded after " + maxRetries + " attempts. " +
                        "Please wait a minute before trying again.", e);
                }
                try {
                    Thread.sleep(waitSeconds * 1000L);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                waitSeconds *= 2; // exponential backoff: 2s, 4s, 8s
            }
        }

        throw new RuntimeException("Unreachable");
    }
    @SuppressWarnings("unchecked")
    private String extractText(Map response) {
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }
}