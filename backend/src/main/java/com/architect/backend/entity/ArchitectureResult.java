package com.architect.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "architecture_results")
@Getter
@Setter
public class ArchitectureResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String architecture;

    @Column(columnDefinition = "TEXT")
    private String database;

    @Column(columnDefinition = "TEXT")
    private String devops;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}