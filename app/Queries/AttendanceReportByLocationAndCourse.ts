export default function attendanceReportByLocationAndCourse() {
  return `
SELECT
    s.full_name studentName,
    l.name as locationName,
    c.name as courseName,
    CONCAT(count(s.id), '(', FLOOR((100 * count(s.id))  / FLOOR(DATEDIFF(DATE(NOW()), DATE(s.created_at)) / 7)),'%)') as present,
    FLOOR(DATEDIFF(DATE(NOW()), DATE(s.created_at)) / 7) - count(s.id) absent
FROM attendances a
         INNER JOIN students s on a.student_id = s.id
         INNER JOIN courses c on a.course_id = c.id
         INNER JOIN day_of_week dow on c.day_of_week = dow.value
         INNER JOIN locations l on c.location_id = l.id
WHERE check_in IS TRUE AND
      (c.location_id = :locationId || :locationId < 0) AND
      (c.id = :courseId || :courseId < 0) AND
      s.disabled_at IS NULL AND
      DATE(a.time) BETWEEN DATE(:startDate) AND DATE(:endDate) AND
      (:admin IS TRUE || c.location_id = :userLocation)
GROUP BY s.id, s.full_name, l.name, c.name
ORDER BY s.full_name;
`
}
