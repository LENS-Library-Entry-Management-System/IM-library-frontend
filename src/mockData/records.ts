const firstNames = ["John", "Maria", "Alex", "Sophia", "Carlos", "Luna", "Evan", "Grace"];
const lastNames = ["Smith", "Dela Cruz", "Johnson", "Reyes", "Williams", "Santos", "Brown", "Garcia"];

const departments = [
  "Computer Science",
  "Information Systems",
  "Software Engineering",
  "Data Science",
  "Network Technology",
];

const colleges = [
  "College of Computing",
  "College of Engineering",
  "College of Technology",
  "College of Information Science",
];

export const rows = Array.from({ length: 90 }).map((_, i) => {
  const date = new Date(2023, 0, 1 + i); // generate different dates
  const logDate = date.toLocaleDateString("en-US");
  const logTimestamp = date.getTime();
  const logTime = `${String(8 + (i % 10)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;

  return {
    id: `202300000${i}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    department: departments[i % departments.length],
    college: colleges[i % colleges.length],
      logDate,
      logTime,
      logTimestamp,
  };
});

export default rows;
