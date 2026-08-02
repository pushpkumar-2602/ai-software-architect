package com.architect.backend.service;

import org.springframework.stereotype.Service;

import com.architect.backend.agent.DatabaseArchitectAgent;
import com.architect.backend.agent.DevOpsPlannerAgent;
import com.architect.backend.agent.RequirementAnalystAgent;
import com.architect.backend.agent.SystemArchitectAgent;
import com.architect.backend.entity.ArchitectureResult;
import com.architect.backend.entity.Project;
import com.architect.backend.repository.ArchitectureResultRepository;

@Service
public class OrchestrationService {

    private final RequirementAnalystAgent requirementAnalystAgent;
    private final SystemArchitectAgent systemArchitectAgent;
    private final DatabaseArchitectAgent databaseArchitectAgent;
    private final DevOpsPlannerAgent devOpsPlannerAgent;
    private final ArchitectureResultRepository architectureResultRepository;

    public OrchestrationService(RequirementAnalystAgent requirementAnalystAgent,
                                 SystemArchitectAgent systemArchitectAgent,
                                 DatabaseArchitectAgent databaseArchitectAgent,
                                 DevOpsPlannerAgent devOpsPlannerAgent,
                                 ArchitectureResultRepository architectureResultRepository) {
        this.requirementAnalystAgent = requirementAnalystAgent;
        this.systemArchitectAgent = systemArchitectAgent;
        this.databaseArchitectAgent = databaseArchitectAgent;
        this.devOpsPlannerAgent = devOpsPlannerAgent;
        this.architectureResultRepository = architectureResultRepository;
    }

    public ArchitectureResult generateFullArchitecture(Project project) {
        String description = project.getDescription();
        String scale = project.getExpectedUsers();

        String requirements = requirementAnalystAgent.analyze(description, scale);
        String architecture = systemArchitectAgent.design(description, scale);
        String database = databaseArchitectAgent.design(description, scale);
        String devops = devOpsPlannerAgent.plan(description, scale);

        ArchitectureResult result = new ArchitectureResult();
        result.setProject(project);
        result.setRequirements(requirements);
        result.setArchitecture(architecture);
        result.setDatabase(database);
        result.setDevops(devops);

        return architectureResultRepository.save(result);
    }
}