package com.codenestai.ads.repository;
import com.codenestai.ads.model.Course;
import com.codenestai.ads.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findBySlug(String slug);
    Page<Course> findByStatus(Course.Status status, Pageable pageable);
    Page<Course> findByStatusAndLevel(Course.Status status, Course.Level level, Pageable pageable);
    List<Course> findByInstructor(User instructor);
}
