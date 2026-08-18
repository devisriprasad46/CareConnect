package com.careconnect.dto.donation;

import com.careconnect.enums.DonationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDonationDTO {
    @NotNull(message = "Request ID is required")
    private Long requestId;

    private Long donorId; // Taken from security context but kept for API compatibility

    @NotNull(message = "Donation type is required")
    private DonationType donationType;

    private String status; // Optional
    private String message;
    private Double amount;
    private Integer quantity;
}
