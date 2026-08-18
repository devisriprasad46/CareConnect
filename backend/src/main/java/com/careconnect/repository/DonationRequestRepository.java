package com.careconnect.repository;

import com.careconnect.entity.DonationRequest;
import com.careconnect.enums.UrgencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    List<DonationRequest> findAllByOrderByCreatedAtDesc();
    List<DonationRequest> findByOrganizationUserIdOrderByCreatedAtDesc(Long orgId);
    
    @Query("SELECT r FROM DonationRequest r JOIN r.organization u " +
           "WHERE (:category IS NULL OR r.category = :category) " +
           "AND (:urgency IS NULL OR r.urgencyLevel = :urgency) " +
           "AND (:location IS NULL OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "ORDER BY r.createdAt DESC")
    List<DonationRequest> filterRequests(
        @Param("category") String category,
        @Param("urgency") UrgencyLevel urgency,
        @Param("location") String location
    );
}
