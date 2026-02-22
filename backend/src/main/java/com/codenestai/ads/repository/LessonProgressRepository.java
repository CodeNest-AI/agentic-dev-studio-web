package com.codenestai.ads.repository;
import com.codenestai.ads.model.Enrollment;
import com.codenestai.ads.model.Lesson;
import com.codenestai.ads.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    List<LessonProgress> findByEnrollment(Enrollment enrollment);
    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);
    long countByEnrollment(Enrollment enrollment);
}
