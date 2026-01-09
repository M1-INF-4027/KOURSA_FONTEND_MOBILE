/**
 * Koursa - useForm Hook
 * Hook personnalise pour la gestion des formulaires
 */

import { useState, useCallback, useMemo } from 'react';

type ValidationRule<T> = {
  validate: (value: T[keyof T], formValues: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearError: <K extends keyof T>(field: K) => void;
  clearErrors: () => void;
  touch: <K extends keyof T>(field: K) => void;
  validate: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  reset: () => void;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChangeText: (value: T[K]) => void;
    error: string | undefined;
  };
}

/**
 * Hook pour gerer les formulaires avec validation
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [initialState] = useState<T>(initialValues);

  const isDirty = useMemo(() => {
    return Object.keys(values).some(
      (key) => values[key as keyof T] !== initialState[key as keyof T]
    );
  }, [values, initialState]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
    // Clear error when value changes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const touch = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      if (!validationRules || !validationRules[field]) {
        return true;
      }

      const rules = validationRules[field]!;
      for (const rule of rules) {
        if (!rule.validate(values[field], values)) {
          setError(field, rule.message);
          return false;
        }
      }

      clearError(field);
      return true;
    },
    [values, validationRules, setError, clearError]
  );

  const validate = useCallback((): boolean => {
    if (!validationRules) {
      return true;
    }

    let isFormValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field of Object.keys(validationRules) as Array<keyof T>) {
      const rules = validationRules[field];
      if (rules) {
        for (const rule of rules) {
          if (!rule.validate(values[field], values)) {
            newErrors[field] = rule.message;
            isFormValid = false;
            break;
          }
        }
      }
    }

    setErrors(newErrors);
    return isFormValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValuesState(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChangeText: (value: T[K]) => setValue(field, value),
      error: touched[field] ? errors[field] : undefined,
    }),
    [values, errors, touched, setValue]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    touch,
    validate,
    validateField,
    reset,
    getFieldProps,
  };
}

// Validation helpers
export const validationHelpers = {
  required: (message = 'Ce champ est requis') => ({
    validate: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'Email invalide') => ({
    validate: (value: string) => /\S+@\S+\.\S+/.test(value),
    message,
  }),

  minLength: (length: number, message = `Minimum ${length} caracteres`) => ({
    validate: (value: string) => value.length >= length,
    message,
  }),

  maxLength: (length: number, message = `Maximum ${length} caracteres`) => ({
    validate: (value: string) => value.length <= length,
    message,
  }),

  pattern: (regex: RegExp, message = 'Format invalide') => ({
    validate: (value: string) => regex.test(value),
    message,
  }),

  match: <T>(
    fieldToMatch: keyof T,
    message = 'Les valeurs ne correspondent pas'
  ) => ({
    validate: (value: any, formValues: T) => value === formValues[fieldToMatch],
    message,
  }),
};

export default useForm;
