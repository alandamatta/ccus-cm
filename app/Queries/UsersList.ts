export default function studentListTimesheetQuery() {
  return `
SELECT
       u.id,
       u.name,
       email,
       phone,
       l.name AS location,
       IF(u.admin, 'Admin', 'User') as userType
FROM users u
INNER JOIN locations l ON u.location_id = l.id
`
}
