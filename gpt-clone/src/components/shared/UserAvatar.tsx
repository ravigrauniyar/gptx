import { AvatarProps } from "../../types/data";

export const UserAvatar = (avatarProps: AvatarProps) => {
  const { picture, dimension } = avatarProps;
  return (
    <img
      src={picture}
      alt="Profile"
      className={`${dimension} rounded-sm flex justify-center items-center`}
    />
  );
};
