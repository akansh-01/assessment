package com.project.incident.controller;

import com.project.incident.dto.IncidentRequest;
import com.project.incident.dto.IncidentResponse;
import com.project.incident.dto.PageResponse;
import com.project.incident.dto.UpdateIncidentRequest;
import com.project.incident.model.Incident;
import com.project.incident.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(@Valid @RequestBody IncidentRequest request) {
        IncidentResponse response = incidentService.createIncident(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<IncidentResponse>> getIncidents(
            @RequestParam(required = false) String search,
                @RequestParam(required = false) String service,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        // Parse severity list
        List<Incident.Severity> severities = null;
        if (severity != null && !severity.trim().isEmpty()) {
            severities = Arrays.stream(severity.split(","))
                    .map(String::trim)
                    .map(Incident.Severity::valueOf)
                    .collect(Collectors.toList());
        }

        // Parse status list
        List<Incident.Status> statuses = null;
        if (status != null && !status.trim().isEmpty()) {
            statuses = Arrays.stream(status.split(","))
                    .map(String::trim)
                    .map(Incident.Status::valueOf)
                    .collect(Collectors.toList());
        }

        PageResponse<IncidentResponse> response = incidentService.getIncidents(
                search, service, severities, statuses, sortBy, sortDir, page, size
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable UUID id) {
        IncidentResponse response = incidentService.getIncidentById(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIncidentRequest request
    ) {
        IncidentResponse response = incidentService.updateIncident(id, request);
        return ResponseEntity.ok(response);
    }
}
