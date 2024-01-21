export default function studentListTimesheetQuery() {
  return `
SELECT * FROM(
    SELECT
       s.id,
       s.picture,
       c.location_id as locationId,
       sc.course_id as courseId,
       full_name as name,
       DATE_FORMAT(date_of_birth, '%m/%d/%Y') dateOfBirth,
       notes,
       TIME_FORMAT(a_in.time, '%H:%i')  AS checkInTime,
       TIME_FORMAT(a_out.time, '%H:%i') AS checkOutTime,
       TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
       a_in.id as checkInRef,
       a_out.id as checkOutRef
    FROM students s
    LEFT JOIN (
    SELECT
        sc1.student_id,
        sc1.course_id,
        sc1.created_at,
        sc1.disabled_at,
        ROW_NUMBER() OVER (PARTITION BY sc1.student_id ORDER BY sc1.created_at DESC) AS row_num
    FROM
        students_courses sc1
    INNER JOIN courses c1 ON c1.id = sc1.course_id
    INNER JOIN locations l1 ON l1.id = c1.location_id
    WHERE
        l1.id = :locationId  -- Filter by the specific location
) sc ON s.id = sc.student_id AND sc.row_num = 1
    INNER JOIN courses c ON c.id = sc.course_id
    INNER JOIN locations l on c.location_id = l.id
    LEFT JOIN attendances a_in ON s.id = a_in.student_id AND a_in.check_in IS TRUE
                                      AND DATE_FORMAT(a_in.time, '%m/%d/%Y') = DATE_FORMAT(:date, '%m/%d/%Y')
    LEFT JOIN attendances a_out ON s.id = a_out.student_id AND a_out.check_in IS FALSE
                                       AND DATE_FORMAT(a_out.time, '%m/%d/%Y') =  DATE_FORMAT(:date, '%m/%d/%Y')
    LEFT JOIN parents p ON s.parent1_id = p.id
    LEFT JOIN parents p2 ON s.parent2_id = p2.id
    WHERE c.day_of_week = :dayOfTheWeek AND c.location_id = :locationId AND (sc.course_id = :courseId OR :courseId = -1)
    AND (s.full_name LIKE CONCAT('%', TRIM(:search), '%')
             OR p.name LIKE CONCAT('%', TRIM(:search), '%')
             OR p2.name LIKE CONCAT('%', TRIM(:search), '%'))
    AND DATE(sc.created_at) <= DATE(:date)
    AND (sc.disabled_at IS NULL OR DATE(:date) <= DATE(sc.disabled_at))
    ORDER BY s.full_name
) as temp WHERE ((checkInRef IS NULL AND :hideCI IS TRUE) OR :hideCI IS FALSE) AND
                ((checkOutRef IS NULL AND :hideCO IS TRUE) OR :hideCO IS FALSE);
`
}
