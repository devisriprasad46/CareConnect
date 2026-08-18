package com.careconnect.dto.donation;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDonationStatusDTO {
    @NotBlank(message = "Status is required")
    private String status;
}
