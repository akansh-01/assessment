package com.project.incident.config;

import com.project.incident.model.Incident;
import com.project.incident.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final IncidentRepository incidentRepository;

    private static final String[] SERVICES = {
            "Auth", "Payments", "Backend", "Frontend", "Database", 
            "API Gateway", "Notification Service", "User Service",
            "Order Service", "Inventory Service", "Shipping Service"
    };

    private static final String[] TITLES = {
            "Login Failure", "Payment Delay", "API Timeout", "UI Bug on Dashboard",
            "Database Issue", "Authentication Error", "Service Unavailable",
            "High Latency", "Memory Leak", "Connection Pool Exhausted",
            "Cache Miss", "Rate Limit Exceeded", "Data Sync Failure",
            "SSL Certificate Expired", "Disk Space Full", "Network Partition",
            "Configuration Error", "Third-party API Down", "Queue Overflow",
            "Session Expiration", "Token Validation Failed", "CORS Error",
            "Database Deadlock", "Slow Query Performance", "Index Corruption"
    };

    private static final String[] OWNERS = {
            "jason@team", "amy@team", "dev@team", "ops@team", "sre@team",
            "backend@team", "frontend@team", "dba@team", "security@team"
    };

    private static final String[] SUMMARIES = {
            "API requests to the backend service were timing out, causing disruptions for users.",
            "Users unable to authenticate due to token validation issues.",
            "Payment processing delays affecting checkout flow.",
            "UI components not rendering correctly on mobile devices.",
            "Database connection pool exhausted, causing service degradation.",
            "High memory usage detected in production environment.",
            "Third-party API integration experiencing intermittent failures.",
            "Cache invalidation causing increased database load.",
            "Network latency spikes affecting user experience.",
            "Configuration change caused service disruption.",
            "Scheduled job failed to execute, requiring manual intervention.",
            "Data synchronization between services out of sync.",
            "SSL certificate approaching expiration date.",
            "Disk space running low on production servers.",
            "Rate limiting incorrectly configured, blocking legitimate traffic."
    };

    @Override
    public void run(String... args) {
        if (incidentRepository.count() > 0) {
            log.info("Database already seeded. Skipping data seeding.");
            return;
        }

        log.info("Starting database seeding...");
        List<Incident> incidents = generateIncidents(200);
        incidentRepository.saveAll(incidents);
        log.info("Successfully seeded {} incidents into the database.", incidents.size());
    }

    private List<Incident> generateIncidents(int count) {
        List<Incident> incidents = new ArrayList<>();
        Random random = new Random();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < count; i++) {
            // Generate random date within last 90 days
            int daysAgo = random.nextInt(90);
            LocalDateTime createdAt = now.minusDays(daysAgo).minusHours(random.nextInt(24));
            // updatedAt should be >= createdAt, add 0-72 hours
            LocalDateTime updatedAt = createdAt.plusHours(random.nextInt(72));

            Incident.Severity severity = Incident.Severity.values()[random.nextInt(Incident.Severity.values().length)];
            Incident.Status status = Incident.Status.values()[random.nextInt(Incident.Status.values().length)];

            Incident incident = Incident.builder()
                    .title(TITLES[random.nextInt(TITLES.length)] + " #" + (i + 1))
                    .service(SERVICES[random.nextInt(SERVICES.length)])
                    .severity(severity)
                    .status(status)
                    .owner(OWNERS[random.nextInt(OWNERS.length)])
                    .summary(SUMMARIES[random.nextInt(SUMMARIES.length)])
                    .createdAt(createdAt)
                    .updatedAt(updatedAt)
                    .build();

            incidents.add(incident);
        }

        return incidents;
    }
}

