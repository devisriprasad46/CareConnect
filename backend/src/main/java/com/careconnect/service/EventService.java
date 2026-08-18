package com.careconnect.service;

import com.careconnect.dto.event.CreateEventDTO;
import com.careconnect.dto.event.EventResponseDTO;
import com.careconnect.entity.Event;
import com.careconnect.entity.EventParticipant;
import com.careconnect.entity.User;
import com.careconnect.enums.Role;
import com.careconnect.exception.BadRequestException;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.repository.EventParticipantRepository;
import com.careconnect.repository.EventRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final UserService userService;

    public EventService(EventRepository eventRepository, EventParticipantRepository participantRepository, UserService userService) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.userService = userService;
    }

    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAllByOrderByDateAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventResponseDTO> getEventsByCreator(Long creatorId) {
        return eventRepository.findByCreatorUserIdOrderByDateAsc(creatorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventResponseDTO getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return convertToDTO(event);
    }

    public EventResponseDTO createEvent(CreateEventDTO dto, String authenticatedEmail) {
        User creator = userService.convertToEntityByEmail(authenticatedEmail);
        if (creator.getRole() != Role.NGO && creator.getRole() != Role.Volunteer) {
            throw new AccessDeniedException("Only NGOs and Volunteers can host events");
        }

        Event event = Event.builder()
                .creator(creator)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .date(dto.getDate())
                .location(dto.getLocation())
                .build();

        Event saved = eventRepository.save(event);
        return convertToDTO(saved);
    }

    public EventResponseDTO updateEvent(Long eventId, CreateEventDTO dto, String authenticatedEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreator().getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to update this event");
        }

        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());

        Event saved = eventRepository.save(event);
        return convertToDTO(saved);
    }

    public void deleteEvent(Long eventId, String authenticatedEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreator().getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to delete this event");
        }

        eventRepository.delete(event);
    }

    public void joinEvent(Long eventId, String authenticatedEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        User user = userService.convertToEntityByEmail(authenticatedEmail);

        if (participantRepository.existsByEventEventIdAndUserUserId(eventId, user.getUserId())) {
            throw new BadRequestException("You have already joined this event");
        }

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(user)
                .build();

        participantRepository.save(participant);
    }

    public void leaveEvent(Long eventId, String authenticatedEmail) {
        User user = userService.convertToEntityByEmail(authenticatedEmail);
        EventParticipant participant = participantRepository.findByEventEventIdAndUserUserId(eventId, user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Participation not found for this event"));

        participantRepository.delete(participant);
    }

    public List<EventResponseDTO.ParticipantDTO> getEventParticipants(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }

        return participantRepository.findByEventEventId(eventId).stream()
                .map(ep -> EventResponseDTO.ParticipantDTO.builder()
                        .id(ep.getUser().getUserId())
                        .name(ep.getUser().getName())
                        .role(ep.getUser().getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    private EventResponseDTO convertToDTO(Event event) {
        User creator = event.getCreator();
        
        List<EventResponseDTO.ParticipantDTO> participants = participantRepository.findByEventEventId(event.getEventId())
                .stream()
                .map(ep -> EventResponseDTO.ParticipantDTO.builder()
                        .id(ep.getUser().getUserId())
                        .name(ep.getUser().getName())
                        .role(ep.getUser().getRole().name())
                        .build())
                .collect(Collectors.toList());

        EventResponseDTO.CreatorDTO creatorDTO = EventResponseDTO.CreatorDTO.builder()
                .userId(creator.getUserId())
                .name(creator.getName())
                .email(creator.getEmail())
                .location(creator.getLocation())
                .build();

        return EventResponseDTO.builder()
                .id(event.getEventId())
                .eventId(event.getEventId())
                .creatorId(creator.getUserId())
                .creatorName(creator.getName())
                .creatorLocation(creator.getLocation())
                .title(event.getTitle())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .createdAt(event.getCreatedAt())
                .participants(participants)
                .creator(creatorDTO)
                .build();
    }
}
