package com.project.incident.dto;

import com.project.incident.model.Incident;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateIncidentRequest {

    private String title;
    private String service;
    private Incident.Severity severity;
    private Incident.Status status;
    private String owner;
    private String summary;
}

