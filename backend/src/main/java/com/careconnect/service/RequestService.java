package com.careconnect.service;

import com.careconnect.dto.request.CreateRequestDTO;
import com.careconnect.dto.request.RequestResponseDTO;
import com.careconnect.entity.DonationRequest;
import com.careconnect.entity.User;
import com.careconnect.enums.Role;
import com.careconnect.enums.UrgencyLevel;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.repository.DonationRequestRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final DonationRequestRepository requestRepository;
    private final UserService userService;

    public RequestService(DonationRequestRepository requestRepository, UserService userService) {
        this.requestRepository = requestRepository;
        this.userService = userService;
    }

    public List<RequestResponseDTO> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RequestResponseDTO> getRequestsByOrganization(Long orgId) {
        return requestRepository.findByOrganizationUserIdOrderByCreatedAtDesc(orgId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RequestResponseDTO> filterRequests(String category, String urgencyStr, String location) {
        UrgencyLevel urgency = null;
        if (urgencyStr != null && !urgencyStr.trim().isEmpty()) {
            try {
                // Try case-insensitive matching
                for (UrgencyLevel level : UrgencyLevel.values()) {
                    if (level.name().equalsIgnoreCase(urgencyStr)) {
                        urgency = level;
                        break;
                    }
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }
        
        return requestRepository.filterRequests(
                (category != null && !category.trim().isEmpty()) ? category : null,
                urgency,
                (location != null && !location.trim().isEmpty()) ? location : null
        ).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RequestResponseDTO getRequestById(Long requestId) {
        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
        return convertToDTO(request);
    }

    public RequestResponseDTO createRequest(CreateRequestDTO dto, String authenticatedEmail) {
        User user = userService.convertToEntityByEmail(authenticatedEmail);
        if (user.getRole() != Role.NGO) {
            throw new AccessDeniedException("Only NGOs can create requests");
        }

        DonationRequest request = DonationRequest.builder()
                .organization(user)
                .category(dto.getCategory())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .quantity(dto.getQuantity())
                .urgencyLevel(dto.getUrgencyLevel())
                .build();

        DonationRequest saved = requestRepository.save(request);
        return convertToDTO(saved);
    }

    public RequestResponseDTO updateRequest(Long requestId, CreateRequestDTO dto, String authenticatedEmail) {
        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (!request.getOrganization().getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to update this request");
        }

        request.setCategory(dto.getCategory());
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setQuantity(dto.getQuantity());
        request.setUrgencyLevel(dto.getUrgencyLevel());

        DonationRequest saved = requestRepository.save(request);
        return convertToDTO(saved);
    }

    public void deleteRequest(Long requestId, String authenticatedEmail) {
        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (!request.getOrganization().getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to delete this request");
        }

        requestRepository.delete(request);
    }

    public DonationRequest getEntityById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
    }

    private RequestResponseDTO convertToDTO(DonationRequest request) {
        User org = request.getOrganization();
        RequestResponseDTO.OrgDTO orgDTO = RequestResponseDTO.OrgDTO.builder()
                .userId(org.getUserId())
                .name(org.getName())
                .email(org.getEmail())
                .location(org.getLocation())
                .build();

        return RequestResponseDTO.builder()
                .id(request.getRequestId())
                .requestId(request.getRequestId())
                .orgId(org.getUserId())
                .orgName(org.getName())
                .orgLocation(org.getLocation())
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .urgencyLevel(request.getUrgencyLevel().name().toLowerCase())
                .createdAt(request.getCreatedAt())
                .location(org.getLocation())
                .status("open") // Fallback default status
                .organization(orgDTO)
                .build();
    }
}
