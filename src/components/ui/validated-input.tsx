
import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check, AlertCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  validation?: (value: string) => ValidationResult;
  wrapperClassName?: string;
}

export function ValidatedInput({
  label,
  helpText,
  validation,
  wrapperClassName,
  className,
  ...props
}: ValidatedInputProps) {
  const [touched, setTouched] = React.useState(false);
  const [validationState, setValidationState] = React.useState<ValidationResult>({ isValid: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (touched && validation) {
      setValidationState(validation(value));
    }
    props.onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (validation) {
      setValidationState(validation(e.target.value));
    }
    props.onBlur?.(e);
  };

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={props.id}>{label}</Label>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <Input
          {...props}
          className={cn(
            "pr-8",
            touched && validationState.isValid && "border-green-500 focus-visible:ring-green-500",
            touched && !validationState.isValid && "border-destructive focus-visible:ring-destructive",
            className
          )}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {validationState.isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        )}
      </div>
      {touched && !validationState.isValid && validationState.message && (
        <p className="text-sm text-destructive">{validationState.message}</p>
      )}
      {touched && validationState.isValid && helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
