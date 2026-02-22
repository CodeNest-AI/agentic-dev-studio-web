package com.codenestai.ads.repository;
import com.codenestai.ads.model.Course;
import com.codenestai.ads.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCourseOrderByOrderIndexAsc(Course course);
}
