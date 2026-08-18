package com.careconnect.controller;

import com.careconnect.dto.ApiResponse;
import com.careconnect.dto.request.CreateRequestDTO;
import com.careconnect.dto.request.RequestResponseDTO;
import com.careconnect.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RequestResponseDTO>>> getRequests(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long orgId
    ) {
        List<RequestResponseDTO> requests;
        if (orgId != null) {
            requests = requestService.getRequestsByOrganization(orgId);
        } else if (category != null || urgency != null || location != null) {
            requests = requestService.filterRequests(category, urgency, location);
        } else {
            requests = requestService.getAllRequests();
        }
        return ResponseEntity.ok(ApiResponse.success("Requests fetched successfully", requests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestResponseDTO>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Request fetched successfully", requestService.getRequestById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RequestResponseDTO>> createRequest(
            @Valid @RequestBody CreateRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Request created successfully", requestService.createRequest(dto, userDetails.getUsername())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestResponseDTO>> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody CreateRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Request updated successfully", requestService.updateRequest(id, dto, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.deleteRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Request deleted successfully", null));
    }
}
