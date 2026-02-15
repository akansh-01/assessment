package com.project.incident.specification;

import com.project.incident.model.Incident;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class IncidentSpecification {

    public static Specification<Incident> withFilters(
            String search,
            String service,
            List<Incident.Severity> severities,
            List<Incident.Status> statuses
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search filter (searches in title, service, owner, and summary)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), searchPattern
                );
                Predicate servicePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("service")), searchPattern
                );
                Predicate ownerPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("owner")), searchPattern
                );
                Predicate summaryPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("summary")), searchPattern
                );
                predicates.add(criteriaBuilder.or(
                    titlePredicate, servicePredicate, ownerPredicate, summaryPredicate
                ));
            }

            // Service filter
            if (service != null && !service.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("service")), service.toLowerCase()
                ));
            }

            // Severity filter
            if (severities != null && !severities.isEmpty()) {
                predicates.add(root.get("severity").in(severities));
            }

            // Status filter
            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

