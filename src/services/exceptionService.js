import { AppDataSource } from "../config/data-source.js";
import { In } from "typeorm";
import ExceptionRequest from "../entity/ExceptionRequest.js";
const exceptionRepo = AppDataSource.getRepository(ExceptionRequest);

export const createException = async (data) => {
  const {
    employee,
    manager,
    selectedDate,
    primaryReason,
    remarks,
    updatedById,
    updatedByRole,
    currentStatus,
  } = data;

  const exception = exceptionRepo.create({
    employee: employee,
    manager: manager,
    selectedDate,
    primaryReason,
    remarks,
    updatedById,
    updatedByRole,
    currentStatus,
  });

  return await exceptionRepo.save(exception);
};
export const bulkUpdateExceptionRequestService = async ({
  ids,
  status,
  employeeId,
  updatedRole,
}) => {
  // 1️ Perform the update
  await exceptionRepo
    .createQueryBuilder()
    .update(ExceptionRequest)
    .set({
      currentStatus: status,
      updatedBy: employeeId,
      updatedByRole: updatedRole,
    })
    .whereInIds(ids)
    .execute();

  // 2 Fetch the updated records
  const updatedRecords = await exceptionRepo.find({
    where: {
      id: In(ids),
    },
  });
  return updatedRecords;
};

export const getSelectedDatesByMonth = async (employeeId, month, year) => {
  // Compute start and end dates
  const startDate = new Date(year, month - 2, 1); // month-2 because JS Date is 0-based
  const endDate = new Date(year, month, 0); // last day of next month
  endDate.setMonth(endDate.getMonth() + 2); // include one month after

  const records = await exceptionRepo
    .createQueryBuilder("exception")
    .select("exception.selectedDate")
    .where("exception.employeeEmployeeId = :employeeId", { employeeId })
    .andWhere("exception.selectedDate BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .orderBy("exception.selectedDate", "ASC")
    .getRawMany();

  return records.map((r) => r.exception_selectedDate);
};
// export const getFilteredExceptions = async (filters, user) => {
//   const {
//     employeeName,
//     employeeNumber,
//     managerName,
//     projectName,
//     exceptionRequestedDays,
//     exceptionApprovedDays,
//     dateFrom,
//     dateTo,
//     currentStatus,
//     exceptionDateFrom,
//     exceptionDateTo,
//     page = 1,
//     limit = 10,
//   } = filters;

//   const { role, employeeId } = user; // role = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN"

//   const query = exceptionRepo
//     .createQueryBuilder("request")
//     .leftJoin("request.employee", "employee")
//     .leftJoin("request.project", "project")
//     .leftJoin("request.manager", "manager")
//     .leftJoinAndSelect("request.exceptions", "exceptionDetails")
//     .addSelect([
//       "employee.EmployeeNumber",
//       "employee.FirstName",
//       "employee.LastName",
//       "project.ProjectName",
//       "manager.FirstName",
//       "manager.LastName",
//     ]);

//   // 🔒 Role-based data restriction
//   if (role === "EMPLOYEE") {
//     query.andWhere("employee.EmployeeId = :employeeId", { employeeId });
//   } else if (role === "MANAGER") {
//     query.andWhere("manager.EmployeeId = :employeeId", { employeeId });
//   }

//   // 🔍 Filters
//   if (employeeName) {
//     query.andWhere(
//       "(employee.FirstName LIKE :employeeName OR employee.LastName LIKE :employeeName)",
//       { employeeName: `%${employeeName}%` }
//     );
//   }

//   if (employeeNumber) {
//     query.andWhere("employee.EmployeeNumber LIKE :employeeNumber", {
//       employeeNumber: `%${employeeNumber}%`,
//     });
//   }

//   if (managerName) {
//     query.andWhere(
//       "(manager.FirstName LIKE :managerName OR manager.LastName LIKE :managerName)",
//       { managerName: `%${managerName}%` }
//     );
//   }

//   if (projectName) {
//     query.andWhere("project.ProjectName LIKE :projectName", {
//       projectName: `%${projectName}%`,
//     });
//   }

//   if (dateFrom && dateTo) {
//     query.andWhere("request.submissionDate BETWEEN :dateFrom AND :dateTo", {
//       dateFrom,
//       dateTo,
//     });
//   }

//   if (exceptionDateFrom && exceptionDateTo) {
//     query.andWhere(
//       "exceptionDetails.fromDate BETWEEN :exceptionDateFrom AND :exceptionDateTo",
//       { exceptionDateFrom, exceptionDateTo }
//     );
//   }

//   if (currentStatus) {
//     query.andWhere("exceptionDetails.currentStatus = :currentStatus", {
//       currentStatus,
//     });
//   }

//   if (exceptionRequestedDays) {
//     query.andWhere(
//       "exceptionDetails.exceptionRequestedDays = :exceptionRequestedDays",
//       {
//         exceptionRequestedDays,
//       }
//     );
//   }

//   if (exceptionApprovedDays) {
//     query.andWhere(
//       "exceptionDetails.exceptionApprovedDays = :exceptionApprovedDays",
//       {
//         exceptionApprovedDays,
//       }
//     );
//   }

//   // 📅 Sort by latest submission date first
//   query.orderBy("request.submissionDate", "DESC");

//   // 📄 Pagination
//   query.skip((page - 1) * limit).take(limit);

//   const [data, total] = await query.getManyAndCount();

//   // 🧾 Format response
//   return {
//     data: data.map((exception) => ({
//       ...exception,
//       employeeName: `${exception?.employee?.FirstName || ""} ${
//         exception?.employee?.LastName || ""
//       }`.trim(),
//       employeeNumber: exception?.employee?.EmployeeNumber,
//       managerName: `${exception?.manager?.FirstName || ""} ${
//         exception?.manager?.LastName || ""
//       }`.trim(),
//       projectName: exception?.project?.ProjectName,
//     })),
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//   };
// };
