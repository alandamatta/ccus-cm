export default function studentListTimesheetQuery() {
  return `
SELECT c.id, c.name, l.name as location, dow.name AS dayOfWeek, c.time FROM courses c
INNER JOIN locations l ON l.id = c.location_id
INNER JOIN day_of_week dow ON c.day_of_week = dow.value
WHERE
      c.name LIKE CONCAT('%', :search, '%') OR
      c.day_of_week LIKE CONCAT('%', :search, '%') OR
      c.time LIKE CONCAT('%', :search, '%') OR
      l.name LIKE CONCAT('%', :search, '%');
`
}
