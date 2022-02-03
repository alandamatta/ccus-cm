export default function studentListTimesheetQuery() {
  return `
SELECT c.id, c.name, l.name as location, dow.name AS dayOfWeek, c.time, count(s.id) as enrolledStudents FROM courses c
INNER JOIN locations l ON l.id = c.location_id
INNER JOIN day_of_week dow ON c.day_of_week = dow.value
LEFT JOIN students s on c.id = s.course_id
WHERE
      (:admin is TRUE OR c.location_id = :locationId) AND
      (c.name LIKE CONCAT('%', :search, '%') OR
      c.day_of_week LIKE CONCAT('%', :search, '%') OR
      c.time LIKE CONCAT('%', :search, '%') OR
      l.name LIKE CONCAT('%', :search, '%'))
GROUP BY 1,2,3,4
`
}
