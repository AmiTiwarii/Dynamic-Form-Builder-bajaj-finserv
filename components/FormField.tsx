"use client";
import type { FormField } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldComponentProps {
  field: FormField;
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
  error?: string;
}

export default function FormFieldComponent({
  field,
  value,
  onChange,
  error,
}: FormFieldComponentProps) {
  const {
    fieldId,
    type,
    label,
    placeholder,
    required,
    dataTestId,
    options,
    maxLength,
    minLength,
  } = field;

  const renderField = () => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <Input
            id={fieldId}
            type={type}
            placeholder={placeholder || ""}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            data-testid={dataTestId}
            maxLength={maxLength || 100} // Set a reasonable default max length
            minLength={minLength}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={fieldId}
            placeholder={placeholder || ""}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            data-testid={dataTestId}
            maxLength={maxLength}
            minLength={minLength}
            className={error ? "border-red-500" : ""}
          />
        );

      case "dropdown":
        return (
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={onChange}
            data-testid={dataTestId}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : ""}
            onValueChange={onChange}
            className="flex flex-col space-y-2"
            data-testid={dataTestId}
          >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${fieldId}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        if (options && options.length > 0) {
          // Multiple checkboxes
          return (
            <div className="flex flex-col space-y-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}-${option.value}`}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([
                          ...(Array.isArray(value) ? value : []),
                          option.value,
                        ]);
                      } else {
                        onChange(
                          Array.isArray(value)
                            ? value.filter((v) => v !== option.value)
                            : []
                        );
                      }
                    }}
                    data-testid={option.dataTestId}
                  />
                  <Label htmlFor={`${fieldId}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldId}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onChange(Boolean(checked))}
                data-testid={dataTestId}
              />
              <Label htmlFor={fieldId}>{label}</Label>
            </div>
          );
        }

      default:
        return <p>Unsupported field type: {type}</p>;
    }
  };

  return (
    <div className="space-y-2">
      {type !== "checkbox" && (
        <Label htmlFor={fieldId} className="flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
