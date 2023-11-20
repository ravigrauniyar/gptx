import { AvatarProps } from "../../types/data";

export const UserAvatar = (avatarProps: AvatarProps) => {
  const { bgColor, dimension } = avatarProps;
  return (
    <div
      className={`p-1 ${bgColor} ${dimension} rounded-sm flex justify-center items-center`}
    >
      R
    </div>
  );
};
