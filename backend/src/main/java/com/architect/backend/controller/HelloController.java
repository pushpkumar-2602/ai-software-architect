package com.architect.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.architect.backend.entity.Project;
import com.architect.backend.repository.ProjectRepository;
import com.architect.backend.service.MlServiceClient;

@RestController
public class HelloController {

    private final MlServiceClient mlServiceClient;
    private final ProjectRepository projectRepository;

    public HelloController(MlServiceClient mlServiceClient, ProjectRepository projectRepository) {
        this.mlServiceClient = mlServiceClient;
        this.projectRepository = projectRepository;
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
}