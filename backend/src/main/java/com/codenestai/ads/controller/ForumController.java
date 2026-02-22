package com.codenestai.ads.controller;

import com.codenestai.ads.model.*;
import com.codenestai.ads.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    // ─── Categories ───────────────────────────────────────────────────────────

    @GetMapping("/categories")
    public ResponseEntity<List<ForumCategory>> getCategories() {
        return ResponseEntity.ok(forumService.getCategories());
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumCategory> createCategory(
            @RequestBody ForumCategory category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.createCategory(category));
    }

    // ─── Threads ──────────────────────────────────────────────────────────────

    @GetMapping("/categories/{slug}/threads")
    public ResponseEntity<Page<ForumThread>> getThreads(
            @PathVariable String slug,
            @PageableDefault(size = 20, sort = "isPinned,lastActivityAt") Pageable pageable) {
        return forumService.getCategoryBySlug(slug)
                .map(cat -> ResponseEntity.ok(forumService.getThreadsByCategory(cat, pageable)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<ForumThread> getThread(@PathVariable UUID id) {
        return forumService.getThread(id).map(thread -> {
            forumService.incrementViewCount(thread);
            return ResponseEntity.ok(thread);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories/{slug}/threads")
    public ResponseEntity<ForumThread> createThread(
            @PathVariable String slug,
            @RequestBody ForumThread thread,
            @AuthenticationPrincipal User user) {
        ForumCategory category = forumService.getCategoryBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        thread.setCategory(category);
        thread.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.createThread(thread));
    }

    @DeleteMapping("/threads/{id}")
    public ResponseEntity<Void> deleteThread(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        forumService.deleteThread(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/threads/{id}/lock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> lockThread(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        forumService.lockThread(id, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/threads/{id}/pin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> pinThread(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        forumService.pinThread(id, user);
        return ResponseEntity.ok().build();
    }

    // ─── Replies ──────────────────────────────────────────────────────────────

    @GetMapping("/threads/{id}/replies")
    public ResponseEntity<Page<ForumReply>> getReplies(
            @PathVariable UUID id,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        return forumService.getThread(id)
                .map(thread -> ResponseEntity.ok(forumService.getReplies(thread, pageable)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/threads/{id}/replies")
    public ResponseEntity<ForumReply> addReply(
            @PathVariable UUID id,
            @RequestBody ForumReply reply,
            @AuthenticationPrincipal User user) {
        ForumThread thread = forumService.getThread(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        reply.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.addReply(thread, reply));
    }

    @PostMapping("/replies/{id}/accept")
    public ResponseEntity<ForumReply> acceptReply(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(forumService.markAccepted(id, user));
    }

    @DeleteMapping("/replies/{id}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        forumService.deleteReply(id, user);
        return ResponseEntity.noContent().build();
    }
}
