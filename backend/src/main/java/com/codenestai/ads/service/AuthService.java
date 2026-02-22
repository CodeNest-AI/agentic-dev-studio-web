package com.codenestai.ads.service;

import com.codenestai.ads.dto.auth.*;
import com.codenestai.ads.model.User;
import com.codenestai.ads.repository.UserRepository;
import com.codenestai.ads.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${oauth.google.client-id:not-configured}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .authProvider(User.AuthProvider.LOCAL)
                .build();
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.getIsActive()) throw new IllegalStateException("Account is deactivated");
        return buildAuthResponse(user);
    }

    public AuthResponse loginWithGoogle(GoogleAuthRequest req) {
        GoogleIdToken.Payload payload = verifyGoogleToken(req.getIdToken());
        String email   = payload.getEmail();
        String googleId = payload.getSubject();

        User user = userRepository.findByGoogleId(googleId)
                .or(() -> userRepository.findByEmail(email))
                .map(u -> {
                    // Link Google ID if not already linked
                    if (u.getGoogleId() == null) {
                        u.setGoogleId(googleId);
                        u.setAuthProvider(User.AuthProvider.GOOGLE);
                    }
                    return u;
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .firstName((String) payload.get("given_name"))
                        .lastName((String) payload.get("family_name"))
                        .avatarUrl((String) payload.get("picture"))
                        .googleId(googleId)
                        .authProvider(User.AuthProvider.GOOGLE)
                        .build()));

        if (!user.getIsActive()) throw new IllegalStateException("Account is deactivated");
        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshRequest req) {
        if (!jwtUtil.isValid(req.getRefreshToken())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        var claims = jwtUtil.parseToken(req.getRefreshToken());
        if (!"refresh".equals(claims.get("type"))) {
            throw new IllegalArgumentException("Not a refresh token");
        }
        User user = userRepository.findById(jwtUtil.getUserId(req.getRefreshToken()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        return new AuthResponse(accessToken, refreshToken, UserDTO.from(user));
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) throw new SecurityException("Invalid Google ID token");
            return token.getPayload();
        } catch (Exception e) {
            throw new SecurityException("Google token verification failed: " + e.getMessage());
        }
    }
}
