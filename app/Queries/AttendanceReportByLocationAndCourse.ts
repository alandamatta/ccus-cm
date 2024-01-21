export default function attendanceReportByLocationAndCourse() {
  return `
select s.full_name as 'studentName',
       c.name as 'courseName',
       l.name as 'locationName',
       DATE_FORMAT(sc.created_at, '%m/%d/%Y') as 'studentStartDate',
       FLOOR(DATEDIFF(NOW(), sc.created_at) / 7) as 'classes_since_start',
       count(*) as 'present',
       IFNULL((FLOOR(DATEDIFF(NOW(), sc.created_at) / 7) - COUNT(*)), 0) AS 'absent',
       IFNULL(COUNT(*) / FLOOR(DATEDIFF(NOW(), sc.created_at) / 7), 0) AS 'frequency'
from attendances att
    inner join students s on s.id = att.student_id
    inner join courses c on c.id = att.course_id
    inner join locations l on att.location_id = l.id and c.location_id = l.id
    inner join students_courses sc on c.id = sc.course_id and s.id = sc.student_id
where att.check_in IS TRUE and
      att.time >= sc.created_at and
      date(att.time) between date(:startDate) AND date(:endDate) and
      (l.id = :locationId || :locationId < 0) and
      (c.id = :courseId || :courseId < 0) and
      s.disabled_at IS NULL and
      (:admin IS TRUE || c.location_id = :userLocation)
group by att.student_id, att.location_id, c.name, sc.created_at, l.name;
`
}
