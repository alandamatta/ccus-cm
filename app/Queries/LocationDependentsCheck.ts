export default function () {
  return `
SELECT 'Go to student' as label, s.full_name as description, CONCAT('/student/', s.id) as url FROM students s WHERE s.location_id = :locationId
UNION
SELECT 'Go to course' as label, c.name as description, CONCAT('/course/', c.id) as url FROM courses c WHERE c.location_id = :locationId
UNION
SELECT 'Go to user' as label, u.name as description, CONCAT('/user/', u.id) as url FROM users u WHERE u.location_id = :locationId;
`
}
