export default function () {
  return `
  DELETE FROM courses WHERE id = :courseId AND (:admin is TRUE OR location_id = :locationId)
`
}
