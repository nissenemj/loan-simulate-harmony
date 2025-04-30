import { ValidationResult } from "@/components/ui/enhanced-form-field";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Creates a required field validator
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createRequiredValidator = (errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length > 0;
    return {
      isValid,
      message: isValid ? undefined : errorMessage || "This field is required"
    };
  };
};

/**
 * Creates a minimum length validator
 * @param minLength Minimum length required
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createMinLengthValidator = (minLength: number, errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length >= minLength;
    return {
      isValid,
      message: isValid ? undefined : errorMessage || `Must be at least ${minLength} characters`
    };
  };
};

/**
 * Creates a maximum length validator
 * @param maxLength Maximum length allowed
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createMaxLengthValidator = (maxLength: number, errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const isValid = value.trim().length <= maxLength;
    return {
      isValid,
      message: isValid ? undefined : errorMessage || `Must be no more than ${maxLength} characters`
    };
  };
};

/**
 * Creates an email validator
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createEmailValidator = (errorMessage?: string) => {
  return (value: string): ValidationResult => {
    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(value);
    return {
      isValid,
      message: isValid ? undefined : errorMessage || "Please enter a valid email address"
    };
  };
};

/**
 * Creates a numeric validator
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createNumericValidator = (errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const isValid = !isNaN(Number(value)) && value.trim() !== '';
    return {
      isValid,
      message: isValid ? undefined : errorMessage || "Please enter a valid number"
    };
  };
};

/**
 * Creates a positive number validator
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createPositiveNumberValidator = (errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const num = Number(value);
    const isValid = !isNaN(num) && num > 0;
    return {
      isValid,
      message: isValid ? undefined : errorMessage || "Please enter a positive number"
    };
  };
};

/**
 * Creates a number range validator
 * @param min Minimum value
 * @param max Maximum value
 * @param errorMessage Custom error message
 * @returns A validation function
 */
export const createRangeValidator = (min: number, max: number, errorMessage?: string) => {
  return (value: string): ValidationResult => {
    const num = Number(value);
    const isValid = !isNaN(num) && num >= min && num <= max;
    return {
      isValid,
      message: isValid ? undefined : errorMessage || `Value must be between ${min} and ${max}`
    };
  };
};

/**
 * Combines multiple validators into one
 * @param validators Array of validation functions
 * @returns A combined validation function
 */
export const combineValidators = (...validators: ((value: string) => ValidationResult)[]) => {
  return (value: string): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};

/**
 * Hook to get translated validation messages
 */
export const useValidationMessages = () => {
  const { t } = useLanguage();
  
  return {
    required: t("validation.required") || "This field is required",
    email: t("validation.email") || "Please enter a valid email address",
    numeric: t("validation.numeric") || "Please enter a valid number",
    positiveNumber: t("validation.positiveNumber") || "Please enter a positive number",
    minLength: (length: number) => 
      t("validation.minLength", { length }) || `Must be at least ${length} characters`,
    maxLength: (length: number) => 
      t("validation.maxLength", { length }) || `Must be no more than ${length} characters`,
    range: (min: number, max: number) => 
      t("validation.range", { min, max }) || `Value must be between ${min} and ${max}`
  };
};
