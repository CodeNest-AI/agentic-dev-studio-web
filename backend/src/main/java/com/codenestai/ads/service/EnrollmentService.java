package com.codenestai.ads.service;

import com.codenestai.ads.model.*;
import com.codenestai.ads.repository.EnrollmentRepository;
import com.codenestai.ads.repository.LessonProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public boolean isEnrolled(User user, Course course) {
        return enrollmentRepository.existsByUserAndCourse(user, course);
    }

    public Enrollment enroll(User user, Course course, String paymentIntentId) {
        if (isEnrolled(user, course)) {
            throw new IllegalStateException("Already enrolled in this course");
        }
        return enrollmentRepository.save(Enrollment.builder()
                .user(user)
                .course(course)
                .paymentIntentId(paymentIntentId)
                .build());
    }

    public List<Enrollment> getUserEnrollments(User user) {
        return enrollmentRepository.findByUser(user);
    }

    public Optional<Enrollment> getEnrollment(User user, Course course) {
        return enrollmentRepository.findByUserAndCourse(user, course);
    }

    public LessonProgress markLessonComplete(Enrollment enrollment, Lesson lesson) {
        return lessonProgressRepository.findByEnrollmentAndLesson(enrollment, lesson)
                .orElseGet(() -> lessonProgressRepository.save(
                        LessonProgress.builder()
                                .enrollment(enrollment)
                                .lesson(lesson)
                                .completedAt(Instant.now())
                                .build()));
    }

    public List<LessonProgress> getProgress(Enrollment enrollment) {
        return lessonProgressRepository.findByEnrollment(enrollment);
    }

    public int getCompletionPercent(Enrollment enrollment) {
        int total = enrollment.getCourse().getTotalLessons();
        if (total == 0) return 0;
        long completed = lessonProgressRepository.countByEnrollment(enrollment);
        int percent = (int) ((completed * 100) / total);
        if (percent == 100 && enrollment.getCompletedAt() == null) {
            enrollment.setCompletedAt(Instant.now());
            enrollment.setStatus(Enrollment.Status.COMPLETED);
            enrollmentRepository.save(enrollment);
        }
        return percent;
    }

    public void cancelEnrollment(UUID enrollmentId, User requestingUser) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));
        if (!enrollment.getUser().getId().equals(requestingUser.getId())
                && requestingUser.getRole() != User.Role.ADMIN) {
            throw new SecurityException("Not authorised");
        }
        enrollment.setStatus(Enrollment.Status.CANCELLED);
        enrollmentRepository.save(enrollment);
    }
}
