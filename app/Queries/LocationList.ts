export default function studentListTimesheetQuery() {
  return `
SELECT id,
       name,
       city,
       state,
       zip
FROM locations WHERE name like ?
AND (deleted_at IS NULL OR DATE_FORMAT(deleted_at, '%Y') = '0000')
`
}
