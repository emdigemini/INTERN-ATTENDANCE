import TakePicture from "../../components/attendance/TakePicture"
import InternSelector from "../../components/attendance/InternSelector"
import AttendanceStats from "../../components/attendance/AttendanceStats"
import DateRange from "../../components/attendance/DateRange"
import { useInternContext } from "../../context/InternContext"
import IsLoading from "../../components/IsLoading"

const InternAttendance = () => {
  const { isLoading } = useInternContext();
  return (
    <>
      {isLoading && (
        <IsLoading 
          loadingMessage="Loading..."
        />
      )}
      <div className="flex h-full w-full flex-col gap-6">
        <div className="flex w-full">
          <div className="flex-1">
            <TakePicture />
          </div>

          <div className="flex-1">
            <InternSelector />
          </div>
        </div>

        <div className="flex w-full gap-12 px-6">
          <div className="flex-1">
            <AttendanceStats />
          </div>

          <div className="flex-1">
            <DateRange />
          </div>
        </div>
      </div>
    </>
  )
}

export default InternAttendance
