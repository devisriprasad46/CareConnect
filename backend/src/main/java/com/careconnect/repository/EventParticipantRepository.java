package com.careconnect.repository;

import com.careconnect.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    List<EventParticipant> findByEventEventId(Long eventId);
    List<EventParticipant> findByUserUserId(Long userId);
    boolean existsByEventEventIdAndUserUserId(Long eventId, Long userId);
    Optional<EventParticipant> findByEventEventIdAndUserUserId(Long eventId, Long userId);
}
