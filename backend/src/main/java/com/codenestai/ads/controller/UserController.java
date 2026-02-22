package com.codenestai.ads.controller;

import com.codenestai.ads.dto.auth.UpdateProfileRequest;
import com.codenestai.ads.dto.auth.UserDTO;
import com.codenestai.ads.model.User;
import com.codenestai.ads.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /** Current user's profile */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDTO.from(user));
    }

    /** Update current user's profile (firstName, lastName, bio, avatarUrl) */
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest req) {

        if (req.getFirstName() != null && !req.getFirstName().isBlank())
            user.setFirstName(req.getFirstName());
        if (req.getLastName() != null && !req.getLastName().isBlank())
            user.setLastName(req.getLastName());
        if (req.getBio() != null)
            user.setBio(req.getBio().isBlank() ? null : req.getBio());
        if (req.getAvatarUrl() != null)
            user.setAvatarUrl(req.getAvatarUrl().isBlank() ? null : req.getAvatarUrl());

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.from(saved));
    }

    /** Public profile by ID (name + avatar only — no email/bio) */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> publicProfile(@PathVariable UUID id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Return a redacted view — omit email for public endpoint
        return ResponseEntity.ok(UserDTO.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole().name())
                .build());
    }
}
