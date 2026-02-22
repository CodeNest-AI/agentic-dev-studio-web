package com.codenestai.ads.service;

import com.codenestai.ads.model.*;
import com.codenestai.ads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ForumService {

    private final ForumCategoryRepository categoryRepository;
    private final ForumThreadRepository threadRepository;
    private final ForumReplyRepository replyRepository;

    // ─── Categories ───────────────────────────────────────────────────────────

    public List<ForumCategory> getCategories() {
        return categoryRepository.findAllByOrderByOrderIndexAsc();
    }

    public Optional<ForumCategory> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    public ForumCategory createCategory(ForumCategory category) {
        return categoryRepository.save(category);
    }

    // ─── Threads ──────────────────────────────────────────────────────────────

    public Page<ForumThread> getThreadsByCategory(ForumCategory category, Pageable pageable) {
        return threadRepository.findByCategory(category, pageable);
    }

    public Optional<ForumThread> getThread(UUID id) {
        return threadRepository.findById(id);
    }

    public ForumThread createThread(ForumThread thread) {
        thread.setLastActivityAt(Instant.now());
        return threadRepository.save(thread);
    }

    public void incrementViewCount(ForumThread thread) {
        thread.setViewCount(thread.getViewCount() + 1);
        threadRepository.save(thread);
    }

    public void lockThread(UUID id, User requestingUser) {
        ForumThread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only admins can lock threads");
        }
        thread.setIsLocked(true);
        threadRepository.save(thread);
    }

    public void pinThread(UUID id, User requestingUser) {
        ForumThread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only admins can pin threads");
        }
        thread.setIsPinned(true);
        threadRepository.save(thread);
    }

    public void deleteThread(UUID id, User requestingUser) {
        ForumThread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!thread.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Not authorised");
        }
        threadRepository.delete(thread);
    }

    // ─── Replies ──────────────────────────────────────────────────────────────

    public Page<ForumReply> getReplies(ForumThread thread, Pageable pageable) {
        return replyRepository.findByThread(thread, pageable);
    }

    public ForumReply addReply(ForumThread thread, ForumReply reply) {
        if (thread.getIsLocked()) {
            throw new IllegalStateException("Thread is locked — no new replies allowed");
        }
        reply.setThread(thread);
        ForumReply saved = replyRepository.save(reply);
        thread.setReplyCount(thread.getReplyCount() + 1);
        thread.setLastActivityAt(Instant.now());
        threadRepository.save(thread);
        return saved;
    }

    public ForumReply markAccepted(UUID replyId, User requestingUser) {
        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Reply not found"));
        ForumThread thread = reply.getThread();
        if (!thread.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only the thread author can mark an accepted answer");
        }
        reply.setIsAccepted(true);
        return replyRepository.save(reply);
    }

    public void deleteReply(UUID replyId, User requestingUser) {
        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Reply not found"));
        if (!reply.getAuthor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Not authorised");
        }
        ForumThread thread = reply.getThread();
        replyRepository.delete(reply);
        thread.setReplyCount(Math.max(0, thread.getReplyCount() - 1));
        threadRepository.save(thread);
    }
}
