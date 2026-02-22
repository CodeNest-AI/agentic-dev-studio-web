package com.codenestai.ads.repository;
import com.codenestai.ads.model.Post;
import com.codenestai.ads.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface PostCommentRepository extends JpaRepository<PostComment, UUID> {
    List<PostComment> findByPostOrderByCreatedAtAsc(Post post);
}
