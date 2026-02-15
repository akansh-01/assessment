package com.project.incident.dto;

import com.project.incident.model.Incident;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {

    private UUID id;
    private String title;
    private String service;
    private Incident.Severity severity;
    private Incident.Status status;
    private String owner;
    private String summary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

