package com.careconnect.repository;

import com.careconnect.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByDateAsc();
    List<Event> findByCreatorUserIdOrderByDateAsc(Long creatorId);
}
