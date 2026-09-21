import { useInternContext } from "../../context/InternContext"
import { getPossibleEndDate } from "../../utils";

const AttendanceStats = () => {
  const { internStats } = useInternContext();

  const remainingHours = internStats
  ? Number(
      (
        internStats.required_hours -
        internStats.completed_hours
      ).toFixed(2)
    )
  : 0;
  const remainingDays = Math.floor(remainingHours / 8);
  const remainingWeeks = Math.floor(remainingDays / 5);
  const daysAfterWeeks = remainingDays % 5;
  const hoursAfterDays = Number((remainingHours % 8).toFixed(2));
  const possibleEndDate = getPossibleEndDate(remainingHours);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          Full Name:
        </span>
        <span className="text-sm text-gray-500">
          {internStats
            ? `${internStats?.first_name} ${internStats?.last_name}`
            : '—'
          }
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          Required Hours:
        </span>
        <span className="text-sm text-gray-500">
          {internStats
            ? `${internStats?.required_hours} hours`
            : '—'
          }
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          Consumed Hours:
        </span>
        <span className="text-sm text-gray-500">
          {internStats
            ? `${internStats?.completed_hours} hours`
            : '—'
          }
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          Remaining Hours:
        </span>
        <span className="text-sm text-gray-500">
          {internStats
            ? `${internStats?.required_hours - internStats?.completed_hours} hours`
            : '—'
          }
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          No. of Weeks Remaining:
        </span>
        <span className="text-sm text-gray-500">
          {internStats ? `${remainingWeeks} weeks ${daysAfterWeeks} days` : "—"}
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-b border-gray-100 py-4">
        <span className="text-sm font-medium text-gray-700">
          No. of Days Remaining:
        </span>
        <span className="text-sm text-gray-500">
          {internStats ? `${remainingDays} days ${hoursAfterDays} hours` : "—"}
        </span>
      </div>

      <div className="flex w-full items-center justify-between py-4">
        <span className="text-sm font-medium text-gray-700">
          Possible end date:
        </span>
        <span className="text-sm font-medium text-gray-600">
          {internStats ? `${possibleEndDate.toLocaleDateString('en-US')}` : "—"}
        </span>
      </div>
    </div>
  )
}

export default AttendanceStats
