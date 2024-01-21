export default function studentByIdAndLocation() {
  return `
  SELECT
    s.id,
    s.full_name AS fullName,
    s.grade,
    DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') AS dateOfBirth,
    sc.course_id AS courseId,
    s.notes,
    s.file,
    s.picture,
    TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) AS ageYears,
    TIMESTAMPDIFF(MONTH, s.date_of_birth, CURDATE()) - (TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) * 12) AS ageMonths,
    s.parent1_id AS parent1Id,
    s.parent2_id AS parent2Id,
    DATE_FORMAT(sc.created_at, '%Y-%m-%d') AS createdAt
FROM
    students s
LEFT JOIN (
    SELECT
        sc1.student_id,
        sc1.course_id,
        sc1.created_at,
        ROW_NUMBER() OVER (PARTITION BY sc1.student_id ORDER BY sc1.created_at DESC) AS row_num
    FROM
        students_courses sc1
    INNER JOIN courses c1 ON c1.id = sc1.course_id
    INNER JOIN locations l1 ON l1.id = c1.location_id
    WHERE
        l1.id = :locationId  -- Filter by the specific location
) sc ON s.id = sc.student_id AND sc.row_num = 1
INNER JOIN courses c ON c.id = sc.course_id
INNER JOIN locations l ON l.id = c.location_id
WHERE
    sc.student_id = :studentId;
  `
}
