package com.project.incident.service.impl;

import com.project.incident.dto.IncidentRequest;
import com.project.incident.dto.IncidentResponse;
import com.project.incident.dto.PageResponse;
import com.project.incident.dto.UpdateIncidentRequest;
import com.project.incident.model.Incident;
import com.project.incident.repository.IncidentRepository;
import com.project.incident.service.IncidentService;
import com.project.incident.specification.IncidentSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;

    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
        log.info("Creating new incident with title: {}", request.getTitle());

        Incident incident = Incident.builder()
                .title(request.getTitle())
                .service(request.getService())
                .severity(request.getSeverity())
                .status(request.getStatus())
                .owner(request.getOwner())
                .summary(request.getSummary())
                .build();

        Incident saved = incidentRepository.save(incident);
        log.info("Incident created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<IncidentResponse> getIncidents(
            String search,
            String service,
            List<Incident.Severity> severities,
            List<Incident.Status> statuses,
            String sortBy,
            String sortDir,
            int page,
            int size
    ) {
        log.info("Fetching incidents with filters - page: {}, size: {}", page, size);

        // Build specification for filtering
        Specification<Incident> spec = IncidentSpecification.withFilters(
                search, service, severities, statuses
        );

        // Build sort
        Sort sort = buildSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Execute query
        Page<Incident> incidentPage = incidentRepository.findAll(spec, pageable);

        // Map to response
        List<IncidentResponse> content = incidentPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<IncidentResponse>builder()
                .content(content)
                .page(incidentPage.getNumber())
                .size(incidentPage.getSize())
                .totalElements(incidentPage.getTotalElements())
                .totalPages(incidentPage.getTotalPages())
                .first(incidentPage.isFirst())
                .last(incidentPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(UUID id) {
        log.info("Fetching incident with id: {}", id);

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        return mapToResponse(incident);
    }

    @Transactional
    public IncidentResponse updateIncident(UUID id, UpdateIncidentRequest request) {
        log.info("Updating incident with id: {}", id);

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        // Update fields if provided
        if (request.getTitle() != null) {
            incident.setTitle(request.getTitle());
        }
        if (request.getService() != null) {
            incident.setService(request.getService());
        }
        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            incident.setStatus(request.getStatus());
        }
        if (request.getOwner() != null) {
            incident.setOwner(request.getOwner());
        }
        if (request.getSummary() != null) {
            incident.setSummary(request.getSummary());
        }

        Incident updated = incidentRepository.save(incident);
        log.info("Incident updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    private Sort buildSort(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "createdAt";
        }

        // Map frontend column names to entity field names
        String fieldName = mapSortField(sortBy);

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return Sort.by(direction, fieldName);
    }

    private String mapSortField(String sortBy) {
        // Map common frontend column names to entity fields
        return switch (sortBy.toLowerCase()) {
            case "title" -> "title";
            case "severity" -> "severity";
            case "status" -> "status";
            case "createdat" -> "createdAt";
            case "created_at" -> "createdAt";
            case "owner" -> "owner";
            case "service" -> "service";
            default -> "createdAt";
        };
    }

    private IncidentResponse mapToResponse(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .service(incident.getService())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .owner(incident.getOwner())
                .summary(incident.getSummary())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .build();
    }
}

