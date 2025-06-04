
import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldGroupProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * Form field group component for grouping related form fields
 */
export function FormFieldGroup({
  className,
  children,
  title,
  description,
}: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export interface SplitFormFieldsProps {
  className?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Split form fields component for displaying multiple form fields in columns
 */
export function SplitFormFields({
  className,
  children,
  columns = 2,
}: SplitFormFieldsProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

export default { FormFieldGroup, SplitFormFields };
