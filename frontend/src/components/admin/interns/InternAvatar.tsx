interface InternAvatarProps {
  firstName: string;
  lastName: string;
}

const InternAvatar = ({
  firstName,
  lastName,
}: InternAvatarProps) => {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4B2E83] text-sm font-semibold text-white">
      {initials}
    </div>
  );
};

export default InternAvatar;