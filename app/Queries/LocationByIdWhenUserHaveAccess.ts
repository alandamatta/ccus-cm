export default function () {
  return `
  SELECT id,
       name,
       day_of_week,
       time,
       location_id,
       deleted_at
FROM courses
WHERE
      id = :courseId AND
      (location_id = :locationId || :admin IS TRUE)
`
}
