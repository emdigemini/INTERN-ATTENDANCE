import { useMemo, useState } from "react";
import CustomDropdown from "../CustomDropdown";
import { useInternContext } from "../../context/InternContext";

export default function InternSelector() {
  const { interns, selectedIntern, handleInternSelect } = useInternContext();
  const [open, setOpen] = useState(false);

  const handleDropDownOpen = (value: boolean) => {
    setOpen(value);
  }

  const internLists = useMemo(
    () =>
      interns.map((i) => ({
        id: i.intern_id,
        name: `${i.first_name} ${i.last_name}`,
      })),
    [interns]
  );

  return (
    <div className="flex flex-col items-center justify-between h-full relative w-full">
      <div className="flex w-full pl-4 items-center gap-4">
        <h2
          className="whitespace-nowrap text-sm font-medium text-gray-600"
        >
          Full Name:
        </h2>
        <CustomDropdown 
          listValue={internLists}
          selectedList={selectedIntern?.name ?? null}
          selectList={handleInternSelect}
          isOpen={open}
          openDropdown={handleDropDownOpen}
        />
        </div>
        <TimeSetButton 
          selectedIntern={selectedIntern?.id ?? null}
        />
      </div>
  );
}

function TimeSetButton({ selectedIntern }: { selectedIntern: string | null }) {
  const { attendanceStatus, photo, timeIn, timeOut } = useInternContext();

  return (
    <button
      disabled={!selectedIntern || !photo || !photo.data}
      type="button"
      className="
        flex h-12 w-full
        items-center justify-center
        rounded-md
        bg-[#0877d1]
        px-6
        text-sm font-semibold
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:bg-[#0668b8]
        hover:shadow-md
        active:scale-[0.98]
        cursor-pointer

        disabled:cursor-not-allowed
      disabled:bg-gray-200
      disabled:text-gray-400
        disabled:opacity-70
      "
      onClick={() => {
        if (!selectedIntern || !photo || !photo.data) return;
        if (attendanceStatus === 'time_in') {
          timeIn(selectedIntern);
        } else if (String(attendanceStatus) === 'time_out') {
          timeOut(selectedIntern);
        }
      }}
    >
      {attendanceStatus === 'time_in'
        ? 'Time In'
        : 'Time Out'}
    </button>
  )
}