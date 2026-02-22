package com.codenestai.ads.service;

import com.codenestai.ads.model.Post;
import com.codenestai.ads.model.PostComment;
import com.codenestai.ads.model.User;
import com.codenestai.ads.repository.PostCommentRepository;
import com.codenestai.ads.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CommunityService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;

    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Page<Post> getPostsByType(Post.PostType type, Pageable pageable) {
        return postRepository.findByType(type, pageable);
    }

    public Optional<Post> getPost(UUID id) {
        return postRepository.findById(id);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(UUID id, Post details, User requestingUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (!post.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Not authorised to edit this post");
        }
        post.setTitle(details.getTitle());
        post.setContent(details.getContent());
        return postRepository.save(post);
    }

    public void deletePost(UUID id, User requestingUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (!post.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Not authorised to delete this post");
        }
        postRepository.delete(post);
    }

    public Post likePost(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setLikeCount(post.getLikeCount() + 1);
        return postRepository.save(post);
    }

    public PostComment addComment(UUID postId, PostComment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        comment.setPost(post);
        return commentRepository.save(comment);
    }

    public void deleteComment(UUID commentId, User requestingUser) {
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!comment.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Not authorised");
        }
        commentRepository.delete(comment);
    }
}
