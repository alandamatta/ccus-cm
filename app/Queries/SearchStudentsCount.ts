export default function SearchStudentsCount() {
  return `
  SELECT
    COUNT(*) as total
FROM students s
INNER JOIN courses c on s.course_id = c.id
WHERE
    s.location_id = :locationId AND
    (c.id = :courseId OR :courseId <= 0) AND
    (s.full_name LIKE CONCAT('%', :search, '%') OR :search = TRIM('')) AND
    (s.disabled_at IS NULL AND :status = 1) OR  (s.disabled_at IS NOT NULL AND :status = 2) OR (:status NOT IN (1,2))
`
}
