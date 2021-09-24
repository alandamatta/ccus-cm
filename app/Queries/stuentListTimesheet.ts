export default function studentListTimesheetQuery() {
  return `
select
s.id,
s.picture,
full_name as name,
DATE_FORMAT(date_of_birth, '%m/%d/%Y') dateOfBirth,
notes,
a_in.time AS checkin_time,
a_out.time AS checkout_time,
TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age
from students s
left join attendances a_in on s.id = a_in.student_id and a_in.checkIn is true
left join attendances a_out on s.id = a_out.student_id and a_out.checkIn is false
where s.location_id = ?
`
}
