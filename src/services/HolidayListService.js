import { AppDataSource } from "../config/data-source.js";
import HolidayList from "../entity/legacy/HolidayList.js";
import { Between } from "typeorm";
export const getHolidayList = async () => {
  const repository = AppDataSource.getRepository(HolidayList);
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);
  const results = await repository.find({
    select: ["LeaveOn"], // ✅ only this field
    where: {
      LeaveOn: Between(startDate, endDate),
    },
    order: {
      LeaveOn: "ASC",
    },
  });

  // Convert to array of date strings only
  const dates = results
    .filter((x) => x.LeaveOn)
    .map((x) => {
      const d = x.LeaveOn;
      return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    });

  return dates;
};
