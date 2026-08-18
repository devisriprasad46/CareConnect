package com.careconnect.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponseDTO {
    private Long id; // maps to request.id
    private Long requestId; // maps to request.requestId
    private Long orgId;
    private String orgName; // flat structure from PHP api
    private String orgLocation; // flat structure from PHP api
    private String category;
    private String title;
    private String description;
    private Integer quantity;
    private String urgencyLevel; // e.g. "Low", "Medium", "High"
    private LocalDateTime createdAt;
    private String location; // request.location
    private String status; // request.status
    private OrgDTO organization;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrgDTO {
        private Long userId;
        private String name;
        private String email;
        private String location;
    }
}
