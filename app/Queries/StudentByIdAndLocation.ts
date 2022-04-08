export default function studentByIdAndLocation() {
  return `
  SELECT
     s.id,
     s.full_name AS fullName,
     s.grade,
     DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as dateOfBirth,
     sc.course_id AS courseId,
     s.notes,
     s.file,
     s.picture,
     TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) AS ageYears,
     TIMESTAMPDIFF(MONTH , s.date_of_birth, CURDATE()) - (TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) * 12) as ageMonths,
     s.parent1_id AS parent1Id,
     s.parent2_id AS parent2Id,
     sc.disabled_at AS disabledAt,
     DATE_FORMAT(sc.created_at, '%Y-%m-%d') AS createdAt
  FROM students s
      INNER JOIN students_courses sc on s.id = sc.student_id
      INNER JOIN courses c on sc.course_id = c.id
      INNER JOIN locations l on c.location_id = l.id
  WHERE
    (l.id = :locationId)
    AND sc.student_id = :studentId;
  `
}
