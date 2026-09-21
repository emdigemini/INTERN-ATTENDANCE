import { ArrowDownToLine } from "lucide-react";
import { based_url } from "../../axios";
import { useEffect, useState } from "react";
import { useInternContext } from "../../context/InternContext";
import toast from "react-hot-toast";
import type { AttendanceDataType } from "../..";
import { handleExportExcel } from "../../utils";

const DateRange = () => {
  const { selectedIntern } = useInternContext();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<AttendanceDataType[] | []>([]);

  const handleExport = async () => {
    const error = await handleExportExcel({
      attendanceData,
      selectedIntern,
      startDate,
      endDate,
    });

    if (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (!selectedIntern || !selectedIntern.id) return;
    if (!startDate) return;
    if (!endDate) return;
    const fetchAttData = async () => {
      try {
        const res = await based_url.get('/attendance_cnx/attendance-data', {
        params: {
          internId: selectedIntern.id,
          startDate,
          endDate
        }
      });
      setAttendanceData(res.data.attendanceData);
      } catch (err) {
        console.log(err)
      }
    }

    fetchAttData();
  }, [selectedIntern, startDate, endDate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-5">

        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Date and Time Report
          </h2>

          <button
            type="button"
            onClick={handleExport}
            className="
              flex h-11 w-48
              items-center justify-center
              rounded-md
              bg-[#0877d1]
              text-white
              transition cursor-pointer
              hover:bg-[#0668b8]
              active:scale-[0.98]
            "
          >
            <ArrowDownToLine size={20} />
          </button>
        </div>

        {/* Date Range */}
        <div className="flex w-full items-center gap-4">

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-medium text-gray-500">
              Start date
            </label>

            <input
              type="date"
              className="
                h-11 w-full
                rounded-md
                border border-gray-200
                bg-white
                px-3
                text-sm text-gray-700
                outline-none
                transition
                focus:border-[#0877d1]
                focus:ring-2
                focus:ring-[#0877d1]/10
              "
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <span className="mt-6 text-sm text-gray-500">
            to
          </span>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-medium text-gray-500">
              End date
            </label>

            <input
              type="date"
              className="
                h-11 w-full
                rounded-md
                border border-gray-200
                bg-white
                px-3
                text-sm text-gray-700
                outline-none
                transition
                focus:border-[#0877d1]
                focus:ring-2
                focus:ring-[#0877d1]/10
              "
              onChange={(e) => setEndDate(e.target.value)}
            />

          </div>

        </div>

        {/* Report summary */}
        <div className="flex flex-col gap-2">
          {attendanceData ? (
            attendanceData.map(a => {
              const dateIn = new Date(a.time_in).toLocaleDateString('en-US');
              const dateOut = new Date(a.time_out).toLocaleDateString('en-US');
              const dailyHours: Record<string, number> = {};

              if (!a.time_in || !a.time_out) return;

              const timeIn = new Date(a.time_in).getTime();
              const timeOut = new Date(a.time_out).getTime();

              const date = new Date(a.time_in).toLocaleDateString("en-CA");

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

              return (
                <div 
                  key={`${a.intern_id}-${a.time_in}`}
                  className="flex items-center justify-between pt-2"

                >
                  <span className="text-sm text-gray-500">
                    {dateIn} - {dateOut}
                  </span>

                  <span className="text-sm font-semibold text-gray-700">
                    {consumed}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-500">
                Hours by selected date range
              </span>

              <span className="text-sm font-semibold text-gray-700">
                0 Hours
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DateRange;