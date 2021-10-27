export default function () {
  return `
  DELETE FROM courses WHERE id = :courseId AND location_id = :locationId
`
}
