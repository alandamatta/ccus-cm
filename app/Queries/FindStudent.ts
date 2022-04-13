export default function findStudent() {
  return `
SELECT s.id,
       s.full_name,
       s.date_of_birth,
       s.parent1_id,
       s.parent2_id,
       s.location_id,
       s.course_id,
       s.notes,
       s.picture,
       s.file,
       s.active,
       s.created_at,
       s.updated_at,
       s.grade,
       s.disabled_at FROM students s
INNER JOIN students_courses sc on s.id = sc.student_id
INNER JOIN courses c on sc.course_id = c.id
INNER JOIN locations l on c.location_id = l.id
WHERE s.id = :studentId AND l.id = :locationId;
`
}
