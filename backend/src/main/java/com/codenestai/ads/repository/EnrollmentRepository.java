package com.codenestai.ads.repository;
import com.codenestai.ads.model.Course;
import com.codenestai.ads.model.Enrollment;
import com.codenestai.ads.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    Optional<Enrollment> findByUserAndCourse(User user, Course course);
    List<Enrollment> findByUser(User user);
    boolean existsByUserAndCourse(User user, Course course);
    long countByCourse(Course course);
}
