package com.codenestai.ads.controller;

import com.codenestai.ads.model.*;
import com.codenestai.ads.service.CourseService;
import com.codenestai.ads.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final CourseService courseService;

    /** List all courses the authenticated user is enrolled in */
    @GetMapping
    public ResponseEntity<List<Enrollment>> myEnrollments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(user));
    }

    /** Enroll in a course (free or after payment) */
    @PostMapping("/{courseId}")
    public ResponseEntity<Enrollment> enroll(
            @PathVariable UUID courseId,
            @RequestParam(required = false) String paymentIntentId,
            @AuthenticationPrincipal User user) {

        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrollmentService.enroll(user, course, paymentIntentId));
    }

    /** Check enrollment status for a specific course */
    @GetMapping("/{courseId}/status")
    public ResponseEntity<Map<String, Object>> enrollmentStatus(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal User user) {

        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        boolean enrolled = enrollmentService.isEnrolled(user, course);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    /** Get progress for an enrollment */
    @GetMapping("/{enrollmentId}/progress")
    public ResponseEntity<Map<String, Object>> getProgress(
            @PathVariable UUID enrollmentId,
            @AuthenticationPrincipal User user) {

        Enrollment enrollment = enrollmentService.getUserEnrollments(user).stream()
                .filter(e -> e.getId().equals(enrollmentId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        List<LessonProgress> progress = enrollmentService.getProgress(enrollment);
        int percent = enrollmentService.getCompletionPercent(enrollment);

        return ResponseEntity.ok(Map.of(
                "completionPercent", percent,
                "completedLessons", progress.stream().map(p -> p.getLesson().getId()).toList(),
                "status", enrollment.getStatus()
        ));
    }

    /** Mark a lesson as complete */
    @PostMapping("/{enrollmentId}/lessons/{lessonId}/complete")
    public ResponseEntity<LessonProgress> markComplete(
            @PathVariable UUID enrollmentId,
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal User user) {

        Enrollment enrollment = enrollmentService.getUserEnrollments(user).stream()
                .filter(e -> e.getId().equals(enrollmentId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        Lesson lesson = courseService.getLessonsForCourse(enrollment.getCourse()).stream()
                .filter(l -> l.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found in this course"));

        return ResponseEntity.ok(enrollmentService.markLessonComplete(enrollment, lesson));
    }

    /** Cancel an enrollment */
    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<Void> cancel(
            @PathVariable UUID enrollmentId,
            @AuthenticationPrincipal User user) {
        enrollmentService.cancelEnrollment(enrollmentId, user);
        return ResponseEntity.noContent().build();
    }
}
