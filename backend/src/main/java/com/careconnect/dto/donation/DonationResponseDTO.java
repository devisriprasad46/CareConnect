package com.careconnect.dto.donation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationResponseDTO {
    private Long id; // donationId
    private Long donationId;
    private Long requestId;
    private String requestTitle;
    private String category;
    private Long orgId;
    private Long donorId;
    private String donorName;
    private String donorEmail;
    private String donationType;
    private String status;
    private LocalDateTime createdAt;
    
    private RequestInfo request;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestInfo {
        private String title;
        private String description;
    }
}
