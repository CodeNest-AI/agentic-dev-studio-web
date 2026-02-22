package com.codenestai.ads.repository;
import com.codenestai.ads.model.ForumCategory;
import com.codenestai.ads.model.ForumThread;
import com.codenestai.ads.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ForumThreadRepository extends JpaRepository<ForumThread, UUID> {
    Page<ForumThread> findByCategory(ForumCategory category, Pageable pageable);
    Page<ForumThread> findByAuthor(User author, Pageable pageable);
}
