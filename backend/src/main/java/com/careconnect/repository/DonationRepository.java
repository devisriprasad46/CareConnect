package com.careconnect.repository;

import com.careconnect.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findAllByOrderByCreatedAtDesc();
    List<Donation> findByDonorUserIdOrderByCreatedAtDesc(Long donorId);
    List<Donation> findByRequestOrganizationUserIdOrderByCreatedAtDesc(Long orgId);
    List<Donation> findByRequestRequestIdOrderByCreatedAtDesc(Long requestId);
}
