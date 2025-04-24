
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
    <div className={cn("space-y-3", wrapperClassName)}>
      <div className="flex items-start md:items-center justify-between flex-wrap gap-2">
        <Label htmlFor={props.id} className="text-base md:text-sm font-medium text-foreground">
          {label}
        </Label>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" className="p-2 -m-2">
                <AlertCircle className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <Input
          {...props}
          className={cn(
            "pr-8 h-11 md:h-10 text-base md:text-sm",
            touched && validationState.isValid && "border-state-success focus-visible:ring-state-success",
            touched && !validationState.isValid && "border-destructive focus-visible:ring-destructive",
            className
          )}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validationState.isValid ? (
              <Check className="h-5 w-5 md:h-4 md:w-4 text-state-success" />
            ) : (
              <AlertCircle className="h-5 w-5 md:h-4 md:w-4 text-destructive" />
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
