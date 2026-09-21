import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useAdminContext } from '../context/AdminContext';

const LoginAdmin = () => {
  const { loginAdmin } = useAdminContext();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    loginAdmin({ username, password });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001a33]/20 px-4 backdrop-blur-[3px]">
      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-1.5 bg-[#0072CE]" />

        <div className="px-8 pb-5 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0072CE] shadow-sm">
            <LockKeyhole className="text-white" size={26} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[#12304A]">
            Admin Login
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sign in admin account to access the attendance system.
          </p>
        </div>

        {/* Form */}
        <form 
          className="space-y-5 px-8 pb-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-[#173B5C]"
            >
              Username
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="username"
                name="username"
                type="text"
                value={username}
                placeholder="Enter your username"
                className="
                  h-11 w-full rounded-lg
                  border border-gray-200
                  bg-white
                  pl-10 pr-4
                  text-sm text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  hover:border-gray-300
                  focus:border-[#0072CE]
                  focus:ring-2 focus:ring-[#0072CE]/15
                "
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#173B5C]"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                name="password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="
                  h-11 w-full rounded-lg
                  border border-gray-200
                  bg-white
                  pl-10 pr-11
                  text-sm text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  hover:border-gray-300
                  focus:border-[#0072CE]
                  focus:ring-2 focus:ring-[#0072CE]/15
                "
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-gray-400
                  transition cursor-pointer
                  hover:text-gray-600
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="
              h-11 w-full
              rounded-lg
              bg-[#0072CE]
              text-sm font-semibold text-white
              shadow-sm
              transition
              hover:bg-[#005EA8]
              active:scale-[0.99]
              cursor-pointer
            "
          >
            Sign In
          </button>

          <p className="text-center text-xs text-gray-400">
            Authorized personnel only
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginAdmin