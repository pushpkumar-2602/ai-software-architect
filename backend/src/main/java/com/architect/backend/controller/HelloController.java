package com.architect.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.architect.backend.agent.RequirementAnalystAgent;
import com.architect.backend.entity.Project;
import com.architect.backend.repository.ProjectRepository;
import com.architect.backend.service.GeminiService;
import com.architect.backend.service.MlServiceClient;


@RestController
public class HelloController {

    private final MlServiceClient mlServiceClient;
    private final ProjectRepository projectRepository;
    private final GeminiService geminiService;
    private final RequirementAnalystAgent requirementAnalystAgent;

    public HelloController(MlServiceClient mlServiceClient, ProjectRepository projectRepository, 
                            GeminiService geminiService, RequirementAnalystAgent requirementAnalystAgent) {
        this.mlServiceClient = mlServiceClient;
        this.projectRepository = projectRepository;
        this.geminiService = geminiService;
        this.requirementAnalystAgent = requirementAnalystAgent;
    }

    @GetMapping("/")
    public String sayHello() {
        return "Backend is alive!";
    }

    @GetMapping("/check-ml")
    public String checkMlService() {
        return mlServiceClient.checkHealth();
    }

    @PostMapping("/projects")
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/projects")
    public java.util.List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/projects/{id}")
    public Project getProject(@PathVariable java.util.UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    @GetMapping("/projects/{id}/analyze")
    public String analyzeProject(@PathVariable java.util.UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));

        return requirementAnalystAgent.analyze(project.getDescription(), project.getExpectedUsers());
    }

    @GetMapping("/test-gemini")
    public String testGemini() {
        return geminiService.generate("Say hello in exactly 5 words.");
    }

    
}