export default function attendanceReportByLocationAndCourse() {
  return `
SELECT s.id, s.full_name studentName, c.name courseName, l.name locationName, CEIL(COALESCE(count(a.id), 0) / 2) as present,
FORMAT(ABS(CEIL(ABS(DATEDIFF(GREATEST(:startDate, sc.created_at), :endDate)) / 7) - (COUNT(a.id) / 2)), 0) absent,
CONCAT(FORMAT(ABS(FLOOR(100 * (COUNT(a.id) / 2)) / (FLOOR(ABS(DATEDIFF(GREATEST(:startDate, sc.created_at), :endDate)) / 7) + 1)), 0), '%') frequency,
DATE_FORMAT(sc.created_at, '%m/%d/%Y') studentStartDate FROM
students_courses sc
LEFT JOIN attendances a on sc.student_id = a.student_id AND sc.course_id = a.course_id AND DATE(a.time) BETWEEN DATE(:startDate) AND DATE(:endDate)
INNER JOIN students s on sc.student_id = s.id
INNER JOIN courses c on sc.course_id = c.id
INNER JOIN locations l on c.location_id = l.id
WHERE (l.id = :locationId || :locationId < 0) AND
      (c.id = :courseId || :courseId < 0) AND
      s.disabled_at IS NULL AND
      (:admin IS TRUE || c.location_id = :userLocation)
GROUP BY sc.id, c.id, c.name, s.full_name
ORDER BY s.full_name;

`
}
