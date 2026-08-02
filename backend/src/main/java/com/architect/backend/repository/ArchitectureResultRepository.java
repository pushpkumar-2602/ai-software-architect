package com.architect.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.architect.backend.entity.ArchitectureResult;

@Repository
public interface ArchitectureResultRepository extends JpaRepository<ArchitectureResult, UUID> {
    Optional<ArchitectureResult> findByProjectId(UUID projectId);
}