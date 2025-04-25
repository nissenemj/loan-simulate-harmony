
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ResponsiveFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  wrapperClassName?: string;
}

export function ResponsiveFormField({
  label,
  error,
  helpText,
  wrapperClassName,
  className,
  ...props
}: ResponsiveFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        className={cn(
          "w-full px-3 py-2 text-sm sm:text-base",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined}
        {...props}
      />
      {error && (
        <p 
          id={`${props.id}-error`} 
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {helpText && !error && (
        <p 
          id={`${props.id}-help`} 
          className="text-sm text-muted-foreground"
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
