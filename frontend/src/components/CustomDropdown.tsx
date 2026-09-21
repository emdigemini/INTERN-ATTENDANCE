import { X } from "lucide-react";
import { useMemo } from "react";
import { pascalCase } from "../utils";
import type { DropdownListType } from "..";

interface CustomDropdownProps {
  listValue: DropdownListType[];
  selectedList: string | null;
  selectList: ({ id, name }: DropdownListType) => void;
  isOpen: boolean;
  openDropdown: (value: boolean) => void;
}

const CustomDropdown = ({
  listValue,
  selectedList,
  selectList,
  isOpen,
  openDropdown,
}: CustomDropdownProps) => {
  const isSelected = listValue.some(
    (item) => item.name.toLowerCase() === selectedList?.toLowerCase()
  );

  const filteredList = useMemo(() => {
    const value = selectedList?.trim().toLowerCase() ?? '';

    return listValue.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
  }, [listValue, selectedList]);

  return (
    <div className="relative w-full">
      <div
        className="
          w-full
          rounded-md
          border border-gray-300
          px-4 py-3
          text-xl
          transition
          focus-within:border-[#0072CE]
          focus-within:ring-2
          focus-within:ring-[#0072CE]/20
        "
      >
        {isSelected ? (
          <div
            className="
              flex w-max
              items-center gap-2
              rounded-full
              border border-gray-200
              bg-white
              px-3.5 py-2
              text-sm font-medium
              text-gray-700
              shadow-sm
            "
          >
            <span>{pascalCase(selectedList ?? '')}</span>

            <button
              type="button"
              onClick={() => {
                selectList({id: '', name: ''});
                openDropdown(false);
              }}
              className="
                flex h-5 w-5
                cursor-pointer
                items-center justify-center
                rounded-full
                text-gray-400
                transition-colors
                hover:bg-gray-100
                hover:text-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-[#0072CE]/20
              "
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={selectedList ?? ''}
            onChange={(e) => {
              const search = e.target.value.trim().toLowerCase();
              const result = listValue.filter(intern => intern.name.toLowerCase().includes(search));
              console.log(result)
              openDropdown(true);
            }}
            onFocus={() => openDropdown(true)}
            onBlur={() => openDropdown(false)}
            placeholder="Type..."
            className="
              w-full
              text-xl
              outline-none
            "
          />
        )}
      </div>

      {isOpen && !isSelected && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            max-h-60
            overflow-y-auto
            rounded-md
            border border-gray-200
            bg-white
            shadow-lg
          "
        >
          {filteredList.length > 0 ? (
            filteredList.map((intern) => (
              <button
                key={intern.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  selectList(intern);
                  openDropdown(false);
                }}
                className="
                  flex w-full
                  cursor-pointer
                  items-center
                  px-4 py-3
                  text-left
                  text-sm
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                {intern.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No intern found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;