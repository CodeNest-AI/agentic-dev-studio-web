package com.codenestai.ads.controller;

import com.codenestai.ads.model.Post;
import com.codenestai.ads.model.PostComment;
import com.codenestai.ads.model.User;
import com.codenestai.ads.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/posts")
    public ResponseEntity<Page<Post>> listPosts(
            @RequestParam(required = false) Post.PostType type,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(type != null
                ? communityService.getPostsByType(type, pageable)
                : communityService.getPosts(pageable));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<Post> getPost(@PathVariable UUID id) {
        return communityService.getPost(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(
            @RequestBody Post post,
            @AuthenticationPrincipal User user) {
        post.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createPost(post));
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable UUID id,
            @RequestBody Post details,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(communityService.updatePost(id, details, user));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        communityService.deletePost(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable UUID id) {
        return ResponseEntity.ok(communityService.likePost(id));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<PostComment> addComment(
            @PathVariable UUID id,
            @RequestBody PostComment comment,
            @AuthenticationPrincipal User user) {
        comment.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communityService.addComment(id, comment));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        communityService.deleteComment(id, user);
        return ResponseEntity.noContent().build();
    }
}
