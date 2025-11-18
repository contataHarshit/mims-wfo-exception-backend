import { Between, Like } from "typeorm";
import { AppDataSource } from "../config/data-source.js";
import ExceptionRequest from "../entity/ExceptionRequest.js";

const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

export const getExceptionSummaryService = async ({
  fromDate,
  toDate,
  employeeNumber,
  managerEmployeeNumber,
  reason,
  page = 1,
  limit = 10,
  exportAll = false,
}) => {
  // const offset = (page - 1) * limit;
  const whereCondition = {};

  // Required Date Range Filter
  if (fromDate && toDate) {
    whereCondition.selectedDate = Between(new Date(fromDate), new Date(toDate));
  }

  // Optional Employee filter
  if (employeeNumber) {
    whereCondition.employee = {
      EmployeeNumber: Like(`%${employeeNumber}%`),
    };
  }

  // Optional Manager filter
  if (managerEmployeeNumber) {
    whereCondition.manager = {
      EmployeeNumber: Like(`%${managerEmployeeNumber}%`),
    };
  }

  // Optional Reason filter
  if (reason) {
    whereCondition.primaryReason = Like(`%${reason}%`);
  }
  // Fetch all filtered records (no pagination here)
  const requests = await exceptionRepo.find({
    where: whereCondition,
    relations: ["employee", "manager", "employee.currentDesignation"],
    order: { selectedDate: "DESC" },
    // skip: offset,
    // take: parseInt(limit, 10),
  });

  if (!requests.length) {
    return { message: "No records found", data: [] };
  }

  // Group by Employee first
  const summaryMap = {};

  requests.forEach((req) => {
    const empId = req.employee.EmployeeId;

    if (!summaryMap[empId]) {
      summaryMap[empId] = {
        // employeeId: empId,
        employeeNumber: req.employee.EmployeeNumber,
        employeeName: `${req.employee.FirstName} ${req.employee.LastName}`,
        designation: req.employee.currentDesignation?.Name ?? "NA",
        managerName: req.manager
          ? `${req.manager.FirstName} ${req.manager.LastName}`
          : "NA",
        APPROVED: 0,
        REJECTED: 0,
        PENDING: 0,
        TOTAL: 0,
      };
    }

    summaryMap[empId].TOTAL++;

    if (req.currentStatus === "APPROVED") summaryMap[empId].APPROVED++;
    if (req.currentStatus === "REJECTED") summaryMap[empId].REJECTED++;
    if (req.currentStatus === "PENDING") summaryMap[empId].PENDING++;
  });

  // ✅ Convert grouped result to array
  const employeeSummaryList = Object.values(summaryMap);

  // ✅ Apply pagination on employee count (not request count)
  const totalEmployees = employeeSummaryList.length;
  if (exportAll === true || exportAll === "true") {
    return {
      message: "Summary fetched successfully",
      exportAll: true,
      totalEmployees,
      data: employeeSummaryList, // return everything
    };
  } else {
    const startIndex = (page - 1) * limit;
    const paginatedData = employeeSummaryList.slice(
      startIndex,
      startIndex + limit
    );

    return {
      message: "Summary fetched successfully",
      page,
      limit,
      totalEmployees, // ✅ pagination based on employee count
      totalPages: Math.ceil(totalEmployees / limit),
      data: paginatedData,
    };
  }
};
