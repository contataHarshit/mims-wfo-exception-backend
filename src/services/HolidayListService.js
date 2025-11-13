import { AppDataSource } from "../config/data-source.js";
import HolidayList from "../entity/legacy/HolidayList.js";

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
