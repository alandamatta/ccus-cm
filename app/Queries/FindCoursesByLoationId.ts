export default function () {
  return `
  SELECT a.id, a.name, a.time, a.day_of_week as dayOfWeek, COUNT(s.id) as "usage" FROM courses a
    LEFT JOIN students s on a.id = s.course_id
  WHERE a.location_id = :locationId
  GROUP BY a.id
`
}
