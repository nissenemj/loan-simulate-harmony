import React from "react";
import { cn } from "@/lib/utils";
import { EnhancedFormField, EnhancedFormFieldProps } from "./enhanced-form-field";

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
    <div className={cn("space-y-4 p-4 rounded-lg border bg-muted/20", className)}>
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
  fields: {
    id: string;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    validation?: (value: string) => { isValid: boolean; message?: string };
    helpText?: string;
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }[];
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Split form fields component for displaying multiple form fields in columns
 */
export function SplitFormFields({
  className,
  fields,
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
      {fields.map((field) => (
        <EnhancedFormField
          key={field.id}
          id={field.id}
          name={field.name}
          label={field.label}
          type={field.type || "text"}
          placeholder={field.placeholder}
          required={field.required}
          validation={field.validation}
          helpText={field.helpText}
          className={field.className}
          value={field.value}
          onChange={field.onChange}
        />
      ))}
    </div>
  );
}

export default { FormFieldGroup, SplitFormFields };
