package com.codenestai.ads.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "forum_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ForumCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String slug;

    private String description;
    private String iconUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;
}
