export default function SearchStudents() {
  return `
  SELECT
    s.id,
    s.full_name as fullName,
    s.notes,
    s.picture,
    s.active,
    s.disabled_at as disabledAt
FROM students_courses sc
INNER JOIN students s ON sc.student_id = s.id
INNER JOIN courses c ON sc.course_id = c.id
INNER JOIN locations l ON c.location_id = l.id
WHERE
    l.id = :locationId AND
    (c.id = :courseId OR :courseId <= 0) AND
    (s.full_name LIKE CONCAT('%', :search, '%') OR :search = TRIM('')) AND
    ((sc.disabled_at IS NULL AND :status = 1) OR  (sc.disabled_at IS NOT NULL AND :status = 2) OR (:status NOT IN (1,2)))
    ORDER BY s.created_at DESC
    LIMIT :limit OFFSET :offset;
`
}
