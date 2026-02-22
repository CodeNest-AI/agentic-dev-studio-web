package com.codenestai.ads.dto.auth;
import com.codenestai.ads.model.User;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;
@Data @Builder public class UserDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String bio;
    private String role;
    private Instant createdAt;
    public static UserDTO from(User u) {
        return UserDTO.builder()
            .id(u.getId()).email(u.getEmail())
            .firstName(u.getFirstName()).lastName(u.getLastName())
            .avatarUrl(u.getAvatarUrl()).bio(u.getBio())
            .role(u.getRole().name()).createdAt(u.getCreatedAt()).build();
    }
}
