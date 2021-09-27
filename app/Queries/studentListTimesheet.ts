export default function studentListTimesheetQuery() {
  return `
SELECT
       s.id,
       s.picture,
       s.location_id as locationId,
       s.course_id as courseId,
       full_name as name,
       DATE_FORMAT(date_of_birth, '%m/%d/%Y') dateOfBirth,
       notes,
       TIME_FORMAT(a_in.time, '%H:%i')  AS checkInTime,
       TIME_FORMAT(a_out.time, '%H:%i') AS checkOutTime,
       TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
       a_in.id as checkInRef,
       a_out.id as checkOutRef
FROM students s
LEFT JOIN attendances a_in ON s.id = a_in.student_id AND a_in.check_in IS TRUE
LEFT JOIN attendances a_out ON s.id = a_out.student_id AND a_out.check_in IS FALSE
WHERE s.location_id = ? AND s.course_id = ?
`
}
