package com.codenestai.ads.repository;
import com.codenestai.ads.model.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface ForumCategoryRepository extends JpaRepository<ForumCategory, UUID> {
    List<ForumCategory> findAllByOrderByOrderIndexAsc();
    Optional<ForumCategory> findBySlug(String slug);
}
