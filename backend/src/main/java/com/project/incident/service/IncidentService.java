package com.project.incident.service;

import com.project.incident.dto.IncidentRequest;
import com.project.incident.dto.IncidentResponse;
import com.project.incident.dto.PageResponse;
import com.project.incident.dto.UpdateIncidentRequest;
import com.project.incident.model.Incident;

import java.util.List;
import java.util.UUID;

public interface IncidentService {


    IncidentResponse createIncident(IncidentRequest request);

    PageResponse<IncidentResponse> getIncidents(
            String search,
            String service,
            List<Incident.Severity> severities,
            List<Incident.Status> statuses,
            String sortBy,
            String sortDir,
            int page,
            int size
    );

    IncidentResponse getIncidentById(UUID id);

    IncidentResponse updateIncident(UUID id, UpdateIncidentRequest request);
}