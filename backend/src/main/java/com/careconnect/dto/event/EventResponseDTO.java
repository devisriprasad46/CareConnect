package com.careconnect.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO {
    private Long id; // eventId
    private Long eventId;
    private Long creatorId;
    private String creatorName;
    private String creatorLocation;
    private String title;
    private String description;
    private LocalDate date;
    private String location;
    private LocalDateTime createdAt;
    private List<ParticipantDTO> participants;
    private CreatorDTO creator;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantDTO {
        private Long id; // userId
        private String name;
        private String role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatorDTO {
        private Long userId;
        private String name;
        private String email;
        private String location;
    }
}
