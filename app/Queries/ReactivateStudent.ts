export default `
    UPDATE students_courses studentAndCourse
    inner join students student on student.id = studentAndCourse.student_id
    INNER JOIN courses course ON course.id = studentAndCourse.course_id
    INNER JOIN locations location ON location.id = course.location_id
    SET studentAndCourse.disabled_at = null
    WHERE
        student.id = studentAndCourse.student_id
        AND location.id = :userLocationId
        AND student.id = :studentId;
    `
