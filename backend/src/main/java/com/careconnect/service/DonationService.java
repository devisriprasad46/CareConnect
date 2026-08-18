package com.careconnect.service;

import com.careconnect.dto.donation.CreateDonationDTO;
import com.careconnect.dto.donation.DonationResponseDTO;
import com.careconnect.entity.Donation;
import com.careconnect.entity.DonationRequest;
import com.careconnect.entity.User;
import com.careconnect.enums.DonationStatus;
import com.careconnect.enums.Role;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.repository.DonationRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserService userService;
    private final RequestService requestService;

    public DonationService(DonationRepository donationRepository, UserService userService, RequestService requestService) {
        this.donationRepository = donationRepository;
        this.userService = userService;
        this.requestService = requestService;
    }

    public List<DonationResponseDTO> getAllDonations() {
        return donationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationResponseDTO> getDonationsByDonor(Long donorId) {
        return donationRepository.findByDonorUserIdOrderByCreatedAtDesc(donorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DonationResponseDTO> getDonationsByOrganization(Long orgId) {
        return donationRepository.findByRequestOrganizationUserIdOrderByCreatedAtDesc(orgId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DonationResponseDTO createDonation(CreateDonationDTO dto, String authenticatedEmail) {
        User donor = userService.convertToEntityByEmail(authenticatedEmail);
        if (donor.getRole() != Role.Volunteer) {
            throw new AccessDeniedException("Only Volunteers can make donations");
        }

        DonationRequest request = requestService.getEntityById(dto.getRequestId());
        
        DonationStatus initialStatus = DonationStatus.PENDING;
        if (dto.getStatus() != null) {
            initialStatus = DonationStatus.fromValue(dto.getStatus());
        }

        Donation donation = Donation.builder()
                .request(request)
                .donor(donor)
                .donationType(dto.getDonationType())
                .status(initialStatus)
                .build();

        Donation saved = donationRepository.save(donation);
        return convertToDTO(saved);
    }

    public DonationResponseDTO updateDonationStatus(Long donationId, String statusStr, String authenticatedEmail) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + donationId));

        DonationRequest request = donation.getRequest();
        if (!request.getOrganization().getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to update this donation status");
        }

        DonationStatus newStatus = DonationStatus.fromValue(statusStr);
        donation.setStatus(newStatus);
        
        Donation saved = donationRepository.save(donation);
        return convertToDTO(saved);
    }

    private DonationResponseDTO convertToDTO(Donation donation) {
        DonationRequest req = donation.getRequest();
        User donor = donation.getDonor();
        
        DonationResponseDTO.RequestInfo reqInfo = DonationResponseDTO.RequestInfo.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .build();

        return DonationResponseDTO.builder()
                .id(donation.getDonationId())
                .donationId(donation.getDonationId())
                .requestId(req.getRequestId())
                .requestTitle(req.getTitle())
                .category(req.getCategory())
                .orgId(req.getOrganization().getUserId())
                .donorId(donor.getUserId())
                .donorName(donor.getName())
                .donorEmail(donor.getEmail())
                .donationType(donation.getDonationType().name())
                .status(donation.getStatus().getValue()) // returns "Pending", "Confirmed", or "Completed"
                .createdAt(donation.getCreatedAt())
                .request(reqInfo)
                .build();
    }
}
