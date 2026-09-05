package com.architect.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MlServiceClient {

    private final WebClient webClient;

    public MlServiceClient(@Value("${app.ml-service.url:http://localhost:8000}") String mlServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }

    public String checkHealth() {
        return webClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}