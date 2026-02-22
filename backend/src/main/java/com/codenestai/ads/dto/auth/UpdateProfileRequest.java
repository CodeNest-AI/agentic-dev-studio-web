package com.codenestai.ads.dto.auth;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 1, max = 60, message = "First name must be 1–60 characters")
    private String firstName;

    @Size(min = 1, max = 60, message = "Last name must be 1–60 characters")
    private String lastName;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;

    @Size(max = 1024, message = "Avatar URL must be at most 1024 characters")
    private String avatarUrl;
}
