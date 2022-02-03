export default function () {
  return `
  SELECT id as value, name as label FROM locations WHERE NOT EXISTS (select name from students where course_id = :id)
  union
  SELECT a.id as value, a.name as label FROM locations a INNER JOIN courses c on a.id = c.location_id and c.id = :id
`
}
