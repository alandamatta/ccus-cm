export default function SearchStudentsCount() {
  return `
  SELECT
    count(*) as total
FROM students_courses sc
INNER JOIN students s ON sc.student_id = s.id
INNER JOIN courses c ON sc.course_id = c.id
INNER JOIN locations l ON c.location_id = l.id
WHERE
    l.id = :locationId AND
    (c.id = :courseId OR :courseId <= 0) AND
    (s.full_name LIKE CONCAT('%', :search, '%') OR :search = TRIM('')) AND
    ((sc.disabled_at IS NULL AND :status = 1) OR  (sc.disabled_at IS NOT NULL AND :status = 2) OR (:status NOT IN (1,2)))
    GROUP BY s.id, s.full_name, s.notes, s.picture, s.active, sc.disabled_at
    ORDER BY s.id, s.full_name, s.notes, s.picture, s.active, sc.disabled_at DESC;
`
}
