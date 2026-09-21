import InternAvatar from './InternAvatar';
import Pagination from './Pagination';
import { useInternContext } from '../../../context/InternContext';
import { useMemo, useState } from 'react';
import { useAdminContext } from '../../../context/AdminContext';
import { Pencil } from 'lucide-react';
import { X } from 'lucide-react';
import { based_url } from '../../../axios';
import toast from 'react-hot-toast';
import IsLoading from '../../IsLoading';
import type { EditInternType } from '../../..';
import AdminConfirmation from '../AdminConfirmation';
import { isAxiosError } from 'axios';

const InternList = () => {
  const { admin } = useAdminContext();
  const { allInterns, isLoading, editIntern, setEditIntern } = useInternContext();
  const [search, setSearch] = useState<string>(''); 
  const [isEdit, setIsEdit] = useState(false);

  const filteredList = useMemo(() => {
    return allInterns?.interns.filter((item) =>
      item.first_name.toLowerCase().includes(search) ||
      item.last_name.toLowerCase().includes(search)
    );
  }, [allInterns, search]);

  return (
    <>
      {isLoading && (
        <IsLoading
          loadingMessage='Saving changes'
        />
      )}
      {isEdit && editIntern && 
        <EditIntern
          closeEdit={() => setIsEdit(false)}
          editIntern={editIntern}
        />
      }
      <section className="h-full rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-4xl font-bold text-[#003B70]">
            Interns
          </h1>
        </div>
        <div className="rounded-lg bg-white">
          <div className='flex pr-4 items-center border-b border-gray-200 gap-4'>
            <input
              type="text"
              placeholder="Search Intern"
              className="text-xl w-full p-4 outline-none"
              onChange={(e) => {
                const value = e.target.value.trim().toLowerCase();

                setSearch(value);
              }}
            />
            {admin?.role === 'super_admin' && (
              <select
                name="site"
                id="site"
                className="
                  h-11 w-max
                  rounded-md
                  border border-gray-200
                  bg-white
                  px-3
                  text-sm text-gray-700
                  outline-none
                  transition
                  focus:border-[#0072CE]
                  focus:ring-2 focus:ring-[#0072CE]/10
                  cursor-pointer
                "
              >
                <option value="exxa">EXXA</option>
                <option value="tera">TERA</option>
                <option value="giga">GIGA</option>
                <option value="gbf">GBF</option>
              </select>
            )} 
          </div>

          <div className="h-170 overflow-y-auto">
            {filteredList?.length === 0 && (
              <h2 className="flex min-h-75 items-center justify-center text-xl font-medium text-gray-500">
                No intern found.
              </h2>
            )}
            {filteredList?.map((intern) => (
              <InternListItem
                key={intern.intern_id}
                internId={intern.intern_id}
                firstName={intern.first_name}
                lastName={intern.last_name}
                requiredHours={intern.required_hours}
                completedHours={intern.completed_hours}
                schoolName={intern.school_name}
                startedAt={new Date(intern.started_at).toLocaleDateString('en-US')}
                onEdit={() => setIsEdit(true)}
                editIntern={() => 
                  setEditIntern({
                    internId: intern.intern_id,
                    firstName: intern.first_name,
                    lastName: intern.last_name,
                    requiredHours: intern.required_hours,
                    schoolName: intern.school_name,
                    startedAt: intern.started_at,
                  })}
              />
            ))}
          </div>
          <Pagination
            page={allInterns?.pagination.page ?? 1}
            limit={allInterns?.pagination.limit ?? 25}
            totalItems={allInterns?.pagination.totalItems ?? 0}
            totalPages={allInterns?.pagination.totalPages ?? 0}
          />
        </div>
      </section>
    </>
  );
};

interface InternTypeProps {
  internId: string;
  firstName: string;
  lastName: string;
  requiredHours: number;
  completedHours: number;
  schoolName: string;
  startedAt: string;
}
interface InternListType extends InternTypeProps {
  onEdit: () => void;
  editIntern: ({firstName, lastName, schoolName, requiredHours, startedAt}: EditInternType) => void;
}

const InternListItem = ({
  internId,
  firstName,
  lastName,
  requiredHours,
  completedHours,
  schoolName,
  startedAt,
  onEdit,
  editIntern
}: InternListType) => {
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="relative flex items-center gap-4 border-b border-gray-100 px-6 py-4 transition hover:bg-gray-50/70">
      <button
        type="button"
        className="
          absolute top-3 left-3
          cursor-pointer text-gray-400
          transition-colors
          hover:text-gray-700
        "
        aria-label="Edit"
        onClick={() => {
          onEdit();
          editIntern({internId, firstName, lastName, schoolName, requiredHours, startedAt});
        }}
      >
        <Pencil size={13} strokeWidth={1.6} />
      </button>
      <InternAvatar
        firstName={firstName}
        lastName={lastName}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-800">
              {fullName}
            </p>

            <p className="mt-0.5 truncate text-sm text-gray-500">
              {schoolName}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-medium text-gray-700">
              {requiredHours} hrs
            </p>
            <p className="text-xs text-gray-400">
              {completedHours >= requiredHours ? 'Completed' : 'Required'}
            </p>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Started {startedAt}
          </p>
        </div>
      </div>
    </div>
  );
};

const EditIntern = (
  { closeEdit, editIntern }
  : { closeEdit: () => void, editIntern: EditInternType}
) => {
  const { adminConfirmation, setAdminConfirmation, passwordConfirmation } = useAdminContext();
  const { setIsLoading, fetchAllInterns } = useInternContext();
  const [firstName, setFirstName] = useState<string>(editIntern.firstName);
  const [lastName, setLastName] = useState<string>(editIntern.lastName);
  const [schoolName, setSchoolName] = useState<string>(editIntern.schoolName);
  const [requiredHours, setRequiredHours] = useState<number>(editIntern.requiredHours);
  const [startedAt, setStartedAt] = useState<string>(editIntern.startedAt);
  const date = new Date(startedAt);
  const formatted = date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
  const saveEditedIntern = async () => {
    setIsLoading(true);
    try {
      const res = await based_url.patch(`/admin_cnx/edit-intern?id=${editIntern?.internId}`,
        {firstName, lastName, schoolName, requiredHours, startedAt, passwordConfirmation}
      );
      await fetchAllInterns();
      closeEdit();
      toast.success(res.data.message);
    } catch (err: unknown) {
      console.log(err);
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      {adminConfirmation && (
        <AdminConfirmation 
          confirmApi={() => saveEditedIntern()}
        />
      )}
      <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeEdit();
          }
        }}
      >
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Edit Intern
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Update intern information
              </p>
            </div>

            <button
              type="button"
              onClick={closeEdit}
              className="flex h-7 w-7 items-center justify-center rounded-md cursor-pointer text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4 p-5">

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  className="
                    w-full rounded-lg border border-gray-200
                    px-3 py-2 text-sm text-gray-900
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10
                  "
                  onChange={(e) => setFirstName(e.target.value.trim())}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  className="
                    w-full rounded-lg border border-gray-200
                    px-3 py-2 text-sm text-gray-900
                    outline-none transition
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10
                  "
                  onChange={(e) => setLastName(e.target.value.trim())}
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                School
              </label>

              <input
                type="text"
                value={schoolName}
                className="
                  w-full rounded-lg border border-gray-200
                  px-3 py-2 text-sm text-gray-900
                  outline-none transition
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10
                "
                onChange={(e) => setSchoolName(e.target.value.trim())}
              />
            </div>

            {/* Required Hours */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Required Hours
              </label>

              <div className="relative">
                <input
                  type="number"
                  min={180}
                  value={requiredHours}
                  className="
                    w-full rounded-lg border border-gray-200
                    px-3 py-2 pr-14 text-sm text-gray-900
                    outline-none transition
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10
                  "
                  onChange={(e) => setRequiredHours(Number(e.target.value))}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  hours
                </span>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={formatted}
                className="
                  w-full rounded-lg border border-gray-200
                  px-3 py-2 text-sm text-gray-900
                  outline-none transition
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10
                "
                onChange={(e) => setStartedAt(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
            <button
              type="button"
              onClick={closeEdit}
              className="
                rounded-lg px-4 py-2
                text-sm font-medium text-gray-600
                cursor-pointer transition-colors
                hover:bg-gray-100 hover:text-gray-900
              "
            >
              Cancel
            </button>

            <button
              type="button"
              className="
                rounded-lg bg-purple-700 px-4 py-2
                text-sm font-medium text-white
                cursor-pointer transition-colors
                hover:bg-purple-800
                active:scale-[0.98]
              "
              onClick={() => setAdminConfirmation(true)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InternList;