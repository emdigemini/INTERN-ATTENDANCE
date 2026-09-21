import { LockKeyhole, X, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useAdminContext } from "../../context/AdminContext";

const AdminConfirmation = ({ confirmApi }: { confirmApi: () => Promise<void> }) => {
  const { admin, setAdminConfirmation, passwordConfirmation, setPasswordConfirmation } = useAdminContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = async () => {
    if (!passwordConfirmation) return;

    await confirmApi();
    setAdminConfirmation(false);
    setPasswordConfirmation('');
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <LockKeyhole size={18} className="text-gray-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Admin Confirmation
              </h2>

              <p className="text-xs text-gray-500">
                Verification required
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            onClick={() => setAdminConfirmation(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-5 py-5">
          <p className="text-sm leading-relaxed text-gray-600">
            Please enter your admin password to continue.
          </p>

          <div className="space-y-1">
          <p className="underline text-blue-500">@{admin && admin.username}</p>
            <label
              htmlFor="admin-password"
              className="text-xs font-medium text-gray-700"
            >
              Password
            </label>

            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 ">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirm();
                  }
                }}
                placeholder="Enter your password"
                className="w-full text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
              />
              <button 
                className="text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 cursor-pointer"
            onClick={() => setAdminConfirmation(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!passwordConfirmation}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmation;