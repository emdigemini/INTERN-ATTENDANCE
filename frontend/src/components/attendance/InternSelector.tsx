import { useMemo, useState } from "react";
import CustomDropdown from "../CustomDropdown";
import { useInternContext } from "../../context/InternContext";
import { useAttendanceContext } from "../../context/AttendanceContext";
import type { DropdownListType } from "../..";

export default function InternSelector() {
  const { interns, seniors } = useInternContext();
  const { attendanceStatus, selectedIntern, selectedSenior, setSelectedSenior, handleDropdownSelect, setOTNotes } = useAttendanceContext();
  const [openInternSelector, setOpenInternSelector] = useState(false);
  const [openSeniorSelector, setOpenSeniorSelector] = useState(false);

  const handleInternSelector = (value: boolean) => {
    setOpenInternSelector(value);
    if (value === false) {
      setOpenSeniorSelector(false);
      setSelectedSenior(null);
    }
  }

  const handleSeniorSelector = (value: boolean) => {
    setOpenSeniorSelector(value);
  }

  const handleSeniorSelect = ({ id, name }: DropdownListType) => {
    setSelectedSenior({ id, name });
  }

  const internLists = useMemo(
    () =>
      interns.map((i) => ({
        id: i.intern_id,
        name: `${i.first_name} ${i.last_name}`,
      })),
    [interns]
  );

  const seniorLists = useMemo(
    () =>
      seniors.map((i) => ({
        id: i.senior_id,
        name: `${i.first_name} ${i.last_name}`,
      })),
    [seniors]
  );

  return (
    <div className="flex flex-col items-center justify-between h-full relative w-full">
      <div className="flex w-full pl-4 items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10 mt-2 items-center">
            <h2
              className="whitespace-nowrap text-sm font-medium text-gray-600"
            >
              Full Name:
            </h2>
            <CustomDropdown 
              listValue={internLists}
              selectedList={selectedIntern?.name ?? null}
              selectList={handleDropdownSelect}
              isOpen={openInternSelector}
              openDropdown={handleInternSelector}
            />
          </div>
          {selectedIntern?.id && String(attendanceStatus) === "time_out"
            && (
              <div className="flex gap-6 items-center">
                <h2
                  className="whitespace-nowrap text-sm font-medium text-gray-600"
                >
                  OT Approver:
                </h2>
                <CustomDropdown 
                  listValue={seniorLists}
                  selectedList={selectedSenior?.name ?? null}
                  selectList={handleSeniorSelect}
                  isOpen={openSeniorSelector}
                  openDropdown={handleSeniorSelector}
                />
              </div>
            )
          }
          {selectedIntern?.id && String(attendanceStatus) === "time_out"
            && (
              <div className="flex gap-12 items-center">
                <h2
                  className="whitespace-nowrap text-sm font-medium text-gray-600"
                >
                  OT Notes:
                </h2>
                <OTApproval onWrite={(value) => setOTNotes(value)} />
              </div>
            )
          }
        </div>
        </div>
        <TimeSetButton 
          selectedIntern={selectedIntern?.id ?? null}
        />
      </div>
  );
}

function OTApproval({ onWrite }: { onWrite: (value: string) => void }) {
  return (
      <textarea
        name=""
        onChange={(e) => onWrite(e.target.value)}
        placeholder="OT Notes here..."
        className="
          resize-none w-full rounded-md
          border border-gray-300
          px-4 py-3 text-sm transition
          focus-within:border-[#0072CE]
          focus-within:ring-2 focus:outline-none
          focus-within:ring-[#0072CE]/20
        "
      >

      </textarea>
  )
}

function TimeSetButton({ selectedIntern }: { selectedIntern: string | null }) {
  const { attendanceStatus, photo, timeIn, timeOut } = useAttendanceContext();

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