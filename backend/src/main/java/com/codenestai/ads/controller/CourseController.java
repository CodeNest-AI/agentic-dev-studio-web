package com.codenestai.ads.controller;

import com.codenestai.ads.model.Course;
import com.codenestai.ads.model.Lesson;
import com.codenestai.ads.model.User;
import com.codenestai.ads.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<Course>> listCourses(
            @RequestParam(required = false) Course.Level level,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(level != null
                ? courseService.getPublishedCoursesByLevel(level, pageable)
                : courseService.getPublishedCourses(pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Course> getCourse(@PathVariable String slug) {
        return courseService.getCourseBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable UUID id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(courseService.getLessonsForCourse(course)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> createCourse(
            @RequestBody Course course,
            @AuthenticationPrincipal User user) {
        course.setInstructor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(course));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> updateCourse(
            @PathVariable UUID id,
            @RequestBody Course details,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.updateCourse(id, details, user));
    }

    @PostMapping("/{id}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Lesson> addLesson(
            @PathVariable UUID id,
            @RequestBody Lesson lesson,
            @AuthenticationPrincipal User user) {
        Course course = courseService.getCourseById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        lesson.setCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.addLesson(lesson));
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable UUID lessonId,
            @RequestBody Lesson details,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.updateLesson(lessonId, details, user));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Course>> myCourses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.getInstructorCourses(user));
    }
}
