package com.architect.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.architect.backend.entity.Diagram;

@Repository
public interface DiagramRepository extends JpaRepository<Diagram, UUID> {
    List<Diagram> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}