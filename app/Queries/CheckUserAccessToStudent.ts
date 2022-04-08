export default function checkUserAccessToStudent() {
  return `
SELECT 1 FROM students_courses sc
    INNER JOIN students s on sc.student_id = s.id
    INNER JOIN courses c on sc.course_id = c.id
    INNER JOIN locations l on c.location_id = l.id
WHERE s.id = :studentId AND c.location_id = :locationId;
`
}
