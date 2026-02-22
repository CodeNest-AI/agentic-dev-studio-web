package com.codenestai.ads.repository;
import com.codenestai.ads.model.Post;
import com.codenestai.ads.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findAll(Pageable pageable);
    Page<Post> findByType(Post.PostType type, Pageable pageable);
    Page<Post> findByAuthor(User author, Pageable pageable);
}
