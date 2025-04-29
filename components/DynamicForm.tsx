"use client";

import { useState } from "react";
import type { FormResponse, FormSection } from "@/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormFieldComponent from "@/components/FormField";

interface DynamicFormProps {
  formData: FormResponse;
  userData: {
    rollNumber: string;
    name: string;
  };
}

// Define a type for form values
type FormValues = Record<string, string | string[] | boolean>;

export default function DynamicForm({ formData, userData }: DynamicFormProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { form } = formData;
  const sections = form.sections;
  const currentSection = sections[currentSectionIndex];

  const handleFieldChange = (
    fieldId: string,
    value: string | string[] | boolean
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach((field) => {
      // Check required fields
      if (
        field.required &&
        (formValues[field.fieldId] === undefined ||
          formValues[field.fieldId] === "")
      ) {
        newErrors[field.fieldId] = `${field.label} is required`;
        isValid = false;
      }

      // Check minLength
      if (
        field.minLength &&
        formValues[field.fieldId] &&
        String(formValues[field.fieldId]).length < field.minLength
      ) {
        newErrors[
          field.fieldId
        ] = `${field.label} must be at least ${field.minLength} characters`;
        isValid = false;
      }

      // Check maxLength
      if (
        field.maxLength &&
        formValues[field.fieldId] &&
        String(formValues[field.fieldId]).length > field.maxLength
      ) {
        newErrors[
          field.fieldId
        ] = `${field.label} must be at most ${field.maxLength} characters`;
        isValid = false;
      }

      // Add more validation as needed based on field type
      if (field.type === "email" && formValues[field.fieldId]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(formValues[field.fieldId]))) {
          newErrors[field.fieldId] = "Please enter a valid email address";
          isValid = false;
        }
      }

      if (field.type === "tel" && formValues[field.fieldId]) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(String(formValues[field.fieldId]))) {
          newErrors[field.fieldId] =
            "Please enter a valid 10-digit phone number";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      // Combine user data with form values
      const finalData = {
        userData,
        formValues,
      };
      console.log("Form submitted with data:", finalData);
      alert("Form submitted successfully! Check console for details.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{form.formTitle}</CardTitle>
        <CardDescription>
          Form ID: {form.formId} | Version: {form.version}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold">{currentSection.title}</h3>
            <span className="text-sm text-gray-500">
              Section {currentSectionIndex + 1} of {sections.length}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{currentSection.description}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((currentSectionIndex + 1) / sections.length) * 100
                }%`,
              }}
            ></div>
          </div>

          <div className="space-y-6">
            {currentSection.fields.map((field) => (
              <FormFieldComponent
                key={field.fieldId}
                field={field}
                value={formValues[field.fieldId] || ""}
                onChange={(value) => handleFieldChange(field.fieldId, value)}
                error={errors[field.fieldId]}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentSectionIndex === 0}
          data-testid="prev-button"
        >
          Previous
        </Button>

        {currentSectionIndex < sections.length - 1 ? (
          <Button onClick={handleNext} data-testid="next-button">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} data-testid="submit-button">
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
