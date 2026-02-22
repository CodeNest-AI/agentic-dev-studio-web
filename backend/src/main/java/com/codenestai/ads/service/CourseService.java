package com.codenestai.ads.service;

import com.codenestai.ads.model.Course;
import com.codenestai.ads.model.Lesson;
import com.codenestai.ads.model.User;
import com.codenestai.ads.repository.CourseRepository;
import com.codenestai.ads.repository.EnrollmentRepository;
import com.codenestai.ads.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Page<Course> getPublishedCourses(Pageable pageable) {
        return courseRepository.findByStatus(Course.Status.PUBLISHED, pageable);
    }

    public Page<Course> getPublishedCoursesByLevel(Course.Level level, Pageable pageable) {
        return courseRepository.findByStatusAndLevel(Course.Status.PUBLISHED, level, pageable);
    }

    public Optional<Course> getCourseBySlug(String slug) {
        return courseRepository.findBySlug(slug);
    }

    public Optional<Course> getCourseById(UUID id) {
        return courseRepository.findById(id);
    }

    public List<Course> getInstructorCourses(User instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(UUID id, Course details, User requestingUser) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (!course.getInstructor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only the instructor or admin can update this course");
        }

        course.setTitle(details.getTitle());
        course.setDescription(details.getDescription());
        course.setShortDescription(details.getShortDescription());
        course.setPrice(details.getPrice());
        course.setLevel(details.getLevel());
        course.setStatus(details.getStatus());
        course.setThumbnailUrl(details.getThumbnailUrl());
        course.setPreviewVideoUrl(details.getPreviewVideoUrl());
        return courseRepository.save(course);
    }

    public List<Lesson> getLessonsForCourse(Course course) {
        return lessonRepository.findByCourseOrderByOrderIndexAsc(course);
    }

    public Lesson addLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(UUID lessonId, Lesson details, User requestingUser) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        if (!lesson.getCourse().getInstructor().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only the instructor or admin can update lessons");
        }

        lesson.setTitle(details.getTitle());
        lesson.setContent(details.getContent());
        lesson.setVideoUrl(details.getVideoUrl());
        lesson.setDurationMinutes(details.getDurationMinutes());
        lesson.setOrderIndex(details.getOrderIndex());
        lesson.setIsFreePreview(details.getIsFreePreview());
        return lessonRepository.save(lesson);
    }

    public long getEnrollmentCount(Course course) {
        return enrollmentRepository.countByCourse(course);
    }
}
