package com.careconnect.entity;

import com.careconnect.enums.DonationStatus;
import com.careconnect.enums.DonationType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donationid")
    private Long donationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requestid", nullable = false)
    private DonationRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donorid", nullable = false)
    private User donor;

    @Enumerated(EnumType.STRING)
    @Column(name = "donationtype", nullable = false)
    private DonationType donationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;

    @Column(name = "createdat", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = DonationStatus.PENDING;
        }
    }
}
