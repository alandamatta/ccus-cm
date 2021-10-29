export default function studentByIdAndLocation() {
  return `
  select
     id,
     full_name as fullName,
     grade,
     DATE_FORMAT(date_of_birth, '%Y-%m-%d') as dateOfBirth,
     course_id as courseId,
     notes,
     file,
     picture,
     TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS ageYears,
     TIMESTAMPDIFF(MONTH , date_of_birth, CURDATE()) - (TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) * 12) as ageMonths,
     parent1_id as parent1Id,
     parent2_id as parent2Id,
     disabled_at as disabledAt,
     DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt
  from students
  where
    (location_id = :locationId or :admin is true)
    and id = :studentId
  `
}
