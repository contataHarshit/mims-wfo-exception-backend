import { AppDataSource } from "../config/data-source.js";
import HolidayList from "../entity/legacy/HolidayList.js";
import LeaveInformation from "../entity/legacy/LeaveInformation.js";

export const getHolidayList = async () => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);

  // ✅ Build query
  const results = await AppDataSource.createQueryBuilder()
    .select("holiday.LeaveOn", "LeaveOn")
    .from(HolidayList, "holiday")
    .where("holiday.LeaveOn BETWEEN :start AND :end", {
      start: startDate,
      end: endDate,
    })
    .orderBy("holiday.LeaveOn", "ASC")
    .getRawMany();

  // ✅ Convert to array of formatted date strings
  const dates = results
    .filter((x) => x.LeaveOn)
    .map((x) => {
      const d = new Date(x.LeaveOn);
      return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    });

  return dates;
};
export const getLeaveDatesList = async (employeeId, startDate, endDate) => {
  const pad = (n) => String(n).padStart(2, "0");
  // Fetch leave rows that overlap the selected month
  const leaveRows = await AppDataSource.createQueryBuilder()
    .select(["leave.FromDate AS FromDate", "leave.ToDate AS ToDate"])
    .from(LeaveInformation, "leave")
    .where("leave.EmployeeId = :employeeId", { employeeId })
    .andWhere("leave.IsCancelled = 0 OR leave.IsCancelled IS NULL")
    .andWhere("leave.FromDate <= :endDate AND leave.ToDate >= :startDate", {
      startDate,
      endDate,
    })
    .orderBy("leave.FromDate", "ASC")
    .getRawMany();
  // Format helper
  const format = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  let allDates = [];

  for (const row of leaveRows) {
    const leaveStart = new Date(row.FromDate);
    const leaveEnd = new Date(row.ToDate);

    // Select only the intersection with selected month
    let dt = new Date(leaveStart);

    while (dt <= leaveEnd) {
      if (dt >= startDate && dt <= endDate) {
        allDates.push(format(dt));
      }
      dt.setDate(dt.getDate() + 1);
    }
  }

  // Remove duplicates
  allDates = [...new Set(allDates)];
  return allDates;
};
