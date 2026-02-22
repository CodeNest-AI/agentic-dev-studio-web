package com.codenestai.ads.repository;
import com.codenestai.ads.model.ForumReply;
import com.codenestai.ads.model.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ForumReplyRepository extends JpaRepository<ForumReply, UUID> {
    Page<ForumReply> findByThread(ForumThread thread, Pageable pageable);
}
