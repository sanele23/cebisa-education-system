import { type HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-2 sm:p-4",
  md: "p-3 sm:p-5",
  lg: "p-4 sm:p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { hoverable = false, padding = "md", className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white rounded-2xl border border-slate-100 shadow-card",
          hoverable &&
            "transition-shadow duration-200 hover:shadow-card-hover cursor-pointer",
          paddingClasses[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("flex items-center justify-between mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx("text-base font-semibold text-slate-800", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
