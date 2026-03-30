import { ReactNode } from "react";
import clsx from "clsx";

type ContainerProps = {
  children: ReactNode;
  className?: string;

  /** vertical spacing between children */
  gap?: "sm" | "md" | "lg";

  /** vertical padding */
  padding?: "none" | "sm" | "md" | "lg";

  /** enable stacked layout */
  stack?: boolean;
};

const gapMap = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-10",
};

const paddingMap = {
  none: "",
  sm: "py-2",
  md: "py-6",
  lg: "py-8",
};

export default function Container({
  children,
  className,
  gap = "md",
  padding = "md",
  stack = true,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        // responsive container
        "mx-auto w-full px-[clamp(1rem,2.4vw,2rem)]",
        "max-w-[82rem] 2xl:max-w-[96rem] 3xl:max-w-[110rem]",

        paddingMap[padding],
        stack && ["flex flex-col", gapMap[gap]],
        className,
      )}
    >
      {children}
    </div>
  );
}
