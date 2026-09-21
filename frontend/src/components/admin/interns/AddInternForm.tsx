import { useState } from 'react';
import CustomDropdown from '../../CustomDropdown';
import type { DropdownListType } from '../../..';
import { useAdminContext } from '../../../context/AdminContext';
import AdminConfirmation from '../AdminConfirmation';
import toast from 'react-hot-toast';

const sites = [
  {
    id: 'exxa',
    name: 'exxa'
  },
  {
    id: 'tera',
    name: 'tera'
  },
  {
    id: 'giga',
    name: 'giga'
  },
  {
    id: 'gbf',
    name: 'gbf'
  },
];

const AddInternForm = () => {
  const {
    firstName, setFirstName, lastName, setLastName,
    schoolName, setSchoolName, requiredHours, setRequiredHours,
    companySite, setCompanySite, addNewIntern, adminConfirmation, setAdminConfirmation
   } = useAdminContext();
  
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!firstName || !lastName || !schoolName || !requiredHours || !companySite) {
      toast.error('All fields are required.');
      return;
    }
    setAdminConfirmation(true);
  };

  const handleDropDownSelect = (value: DropdownListType) => {
    setCompanySite(value.name);
  }

  const handleDropDownOpen = (value: boolean) => {
    setOpen(value);
  }

  return (
    <>
      {adminConfirmation && (
        <AdminConfirmation confirmApi={() => 
            addNewIntern({ firstName, lastName, schoolName, requiredHours, companySite })
          } 
        />
      )}
      <section className="h-full rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-8 text-4xl font-bold text-[#003B70]">
          Add New Intern
        </h1>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Intern First Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-xl w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0072CE] focus:ring-2 focus:ring-[#0072CE]/20"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Intern Last Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-xl w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0072CE] focus:ring-2 focus:ring-[#0072CE]/20"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              School Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="text-xl w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0072CE] focus:ring-2 focus:ring-[#0072CE]/20"
            />
          </div>

          <div>
            <label
              htmlFor="requiredHours"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Total Required Hours
            </label>

            <input
              id="requiredHours"
              type="number"
              placeholder="Enter Total Hours"
              min={180}
              value={requiredHours}
              onChange={(e) => setRequiredHours(Number(e.target.value))}
              className="text-xl w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0072CE] focus:ring-2 focus:ring-[#0072CE]/20"
            />
          </div>

          <CustomDropdown
            listValue={sites}
            selectedList={companySite}
            selectList={handleDropDownSelect}
            isOpen={open}
            openDropdown={handleDropDownOpen}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-[#0072CE] py-4 font-semibold text-white transition hover:bg-[#005EA8] cursor-pointer"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
};

export default AddInternForm;