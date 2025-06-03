
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface EnhancedFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  errorMessage?: string;
  validation?: (value: string) => ValidationResult;
  showValidationIcon?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
}

export function EnhancedFormField({
  label,
  helpText,
  errorMessage,
  validation,
  showValidationIcon = true,
  wrapperClassName,
  labelClassName,
  required,
  showRequiredIndicator = true,
  className,
  ...props
}: EnhancedFormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [validationState, setValidationState] = useState<ValidationResult>({ isValid: true });
  const [value, setValue] = useState(props.defaultValue?.toString() || props.value?.toString() || "");
  
  useEffect(() => {
    if (touched && validation && !focused) {
      setValidationState(validation(value));
    }
  }, [value, touched, validation, focused]);
  
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value.toString());
    }
  }, [props.value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (touched && validation && !focused) {
      setValidationState(validation(newValue));
    }
    
    props.onChange?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    setFocused(false);
    
    if (validation) {
      setValidationState(validation(e.target.value));
    }
    
    props.onBlur?.(e);
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(e);
  };
  
  const showError = touched && !validationState.isValid;
  const errorText = showError ? (validationState.message || errorMessage) : null;
  
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <div className="flex justify-between items-center">
        <Label 
          htmlFor={props.id} 
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            showError && "text-destructive",
            labelClassName
          )}
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-destructive">*</span>
          )}
        </Label>
        
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="relative">
        <Input
          {...props}
          value={props.value !== undefined ? props.value : value}
          className={cn(
            "h-11 md:h-10 text-base md:text-sm transition-colors",
            showValidationIcon && "pr-10",
            touched && validationState.isValid && "border-green-500 focus-visible:ring-green-500",
            showError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required={required}
          aria-invalid={showError ? "true" : undefined}
          aria-describedby={showError ? `${props.id}-error` : undefined}
        />
        
        {touched && showValidationIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validationState.isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {showError && errorText && (
        <p 
          id={`${props.id}-error`} 
          className="text-sm font-medium text-red-500"
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

export default EnhancedFormField;
