package com.architect.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.architect.backend.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
}