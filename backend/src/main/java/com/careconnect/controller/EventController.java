package com.careconnect.controller;

import com.careconnect.dto.ApiResponse;
import com.careconnect.dto.event.CreateEventDTO;
import com.careconnect.dto.event.EventResponseDTO;
import com.careconnect.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getEvents(
            @RequestParam(required = false) Long creatorId
    ) {
        List<EventResponseDTO> events;
        if (creatorId != null) {
            events = eventService.getEventsByCreator(creatorId);
        } else {
            events = eventService.getAllEvents();
        }
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event fetched successfully", eventService.getEventById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDTO>> createEvent(
            @Valid @RequestBody CreateEventDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Event created successfully", eventService.createEvent(dto, userDetails.getUsername())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CreateEventDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.updateEvent(id, dto, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        eventService.deleteEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> joinEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        eventService.joinEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Joined event successfully", null));
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        eventService.leaveEvent(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Left event successfully", null));
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<ApiResponse<List<EventResponseDTO.ParticipantDTO>>> getEventParticipants(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ApiResponse.success("Participants fetched successfully", eventService.getEventParticipants(id)));
    }
}
