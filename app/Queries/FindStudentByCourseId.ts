export default function () {
  return `
  SELECT s.id, s.full_name FROM students s where course_id = :courseId
`
}
