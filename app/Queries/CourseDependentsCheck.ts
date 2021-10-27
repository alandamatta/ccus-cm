export default function () {
  return `
  SELECT 'Go to student' as label, s.full_name as description, CONCAT('/student/', s.id) as url FROM students s WHERE s.course_id = :courseId
`
}
