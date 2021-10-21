export default function studentListTimesheetQuery() {
  return `
select * from locations where name like ?
`
}
