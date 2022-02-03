export default function () {
  return `
  DELETE FROM locations WHERE id = :id AND :admin is TRUE
`
}
