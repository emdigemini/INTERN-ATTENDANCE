import type { AttendanceDataType, DropdownListType } from './index';
import ExcelJS from "exceljs";

export function pascalCase(val: string): string {
  return val
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const normalized = word.replace(/[^A-Za-z0-9]/g, "");
      if (!normalized) return "";
      return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    })
    .join(" ");
}

export function getPossibleEndDate(
  remainingHours: number,
  startDate = new Date()
) {
  const hoursPerDay = 8;
  let remaining = remainingHours;

  const date = new Date(startDate);

  while (remaining > 0) {
    const day = date.getDay();

    // Monday to Friday
    if (day >= 1 && day <= 5) {
      const hoursConsumed = Math.min(remaining, hoursPerDay);

      remaining -= hoursConsumed;
    }

    // Move to next day if may remaining hours pa
    if (remaining > 0) {
      date.setDate(date.getDate() + 1);
    }
  }

  return date;
};

export const handleExportExcel = async ({
  attendanceData, selectedIntern, startDate, endDate
}: 
  {
  attendanceData: AttendanceDataType[], selectedIntern: DropdownListType | null,
  startDate: string, endDate: string
}) => {
  if (!selectedIntern || !selectedIntern?.id) return 'Select intern to continue.';
  if (!startDate) return 'Start date is required.';
  if (!endDate) return 'End date is required.';

  const newTab = window.open("", "_blank");

  if (!newTab) {
    alert("Please allow pop-ups for this site.");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "Intern Name", key: "name", width: 25 },
      { header: "Date", key: "date", width: 15 },
      { header: "Time In", key: "timeIn", width: 15 },
      { header: "Time Out", key: "timeOut", width: 15 },
      { header: "Consumed Hours", key: "hours", width: 20 },
    ];

    attendanceData.forEach((item: {
      first_name: string;
      last_name: string;
      time_in: Date | string;
      time_out: Date | string;
      completed_hours: number | string;
    }) => {
      const dailyHours: Record<string, number> = {};

      if (!item.time_in || !item.time_out) return;

      const timeIn = new Date(item.time_in).getTime();
      const timeOut = new Date(item.time_out).getTime();

      const date = new Date(item.time_in).toLocaleDateString("en-CA");

      const hours =
        (timeOut - timeIn) / (1000 * 60 * 60);

      dailyHours[date] = Math.min(
        (dailyHours[date] || 0) + hours,
        8
      );

      const consumed = Object.values(dailyHours).reduce(
        (total, hours) => total + hours,
        0
      ).toFixed(2);

      worksheet.addRow({
        name: `${item.first_name} ${item.last_name}`,
        date: `${new Date(item.time_in).toLocaleDateString('en-US')} - ${new Date(item.time_out).toLocaleDateString('en-US')}`,
        timeIn: new Date(item.time_in).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        timeOut: item.time_out
          ? new Date(item.time_out).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : 'Pending',
        hours: Number(consumed),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);

    newTab.location.href = url;

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);

  } catch (error) {
    console.error("Failed to generate Excel:", error);

    newTab.close();

    return "Failed to generate Excel file.";
  }
};