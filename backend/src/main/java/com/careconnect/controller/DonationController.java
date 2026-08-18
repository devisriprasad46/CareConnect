package com.careconnect.controller;

import com.careconnect.dto.ApiResponse;
import com.careconnect.dto.donation.CreateDonationDTO;
import com.careconnect.dto.donation.DonationResponseDTO;
import com.careconnect.dto.donation.UpdateDonationStatusDTO;
import com.careconnect.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DonationResponseDTO>>> getDonations(
            @RequestParam(required = false) Long donorId,
            @RequestParam(required = false) Long orgId
    ) {
        List<DonationResponseDTO> donations;
        if (donorId != null) {
            donations = donationService.getDonationsByDonor(donorId);
        } else if (orgId != null) {
            donations = donationService.getDonationsByOrganization(orgId);
        } else {
            donations = donationService.getAllDonations();
        }
        return ResponseEntity.ok(ApiResponse.success("Donations fetched successfully", donations));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DonationResponseDTO>> createDonation(
            @Valid @RequestBody CreateDonationDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Donation created successfully", donationService.createDonation(dto, userDetails.getUsername())));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DonationResponseDTO>> updateDonationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDonationStatusDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Donation status updated successfully", donationService.updateDonationStatus(id, dto.getStatus(), userDetails.getUsername())));
    }
}
