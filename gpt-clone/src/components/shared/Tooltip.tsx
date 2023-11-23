import { Tooltip } from "react-tooltip";

declare type TooltipProps = {
  id: string;
};
export const TooltipComponent = (props: TooltipProps) => {
  const { id } = props;
  return (
    <Tooltip
      id={id}
      style={{
        fontSize: "18px",
        backgroundColor: "#000000",
        color: "#ffffff",
        zIndex: 20,
      }}
    />
  );
};
