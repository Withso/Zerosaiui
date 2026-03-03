/* —— DynamicForm — Phase 3 Enhanced —— */
import { useState, useEffect } from 'react';
import { Sparkles, Send, AlertCircle, Check, Loader2 } from 'lucide-react';
import { DSInput, DSSelect, DSToggle, DSButton, DSBadge } from '../ds/atoms';

/* —— Types —— */
type FieldType = 'text' | 'select' | 'textarea' | 'number' | 'toggle';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
  defaultValue?: string | number | boolean;
  validation?: ValidationRule;
  dependsOn?: { field: string; value: string | boolean };
  aiSuggestion?: string;
}

interface DynamicFormProps {
  title?: string;
  description?: string;
  fields?: FormField[];
  onSubmit?: (values: Record<string, string | number | boolean>) => void;
  aiGenerated?: boolean;
  submitting?: boolean;
}

export function DynamicForm({
  title = 'Generate Report',
  description,
  fields,
  onSubmit,
  aiGenerated = true,
  submitting: controlledSubmitting,
}: DynamicFormProps) {
  const formFields = fields || defaultFields;
  const [values, setValues] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    for (const f of formFields) {
      if (f.defaultValue !== undefined) initial[f.id] = f.defaultValue;
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isSubmitting = controlledSubmitting ?? internalSubmitting;

  const updateValue = (id: string, value: string | number | boolean) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setTouched(prev => new Set([...prev, id]));
  };

  /* —— Validation —— */
  const validateField = (field: FormField, value: string | number | boolean | undefined): string | null => {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return field.validation?.message || `${field.label} is required`;
    }
    if (field.validation?.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
      return `Minimum ${field.validation.minLength} characters`;
    }
    if (field.validation?.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
      return `Maximum ${field.validation.maxLength} characters`;
    }
    return null;
  };

  /* —— Real-time validation on touched fields —— */
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    for (const field of formFields) {
      if (touched.has(field.id)) {
        const error = validateField(field, values[field.id]);
        if (error) newErrors[field.id] = error;
      }
    }
    setErrors(newErrors);
  }, [values, touched]);

  /* —— Check if field is visible (dependency) —— */
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.dependsOn) return true;
    return values[field.dependsOn.field] === field.dependsOn.value;
  };

  /* —— Apply AI suggestion —— */
  const applySuggestion = (fieldId: string, suggestion: string) => {
    updateValue(fieldId, suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate all fields */
    const newErrors: Record<string, string> = {};
    const allTouched = new Set<string>();
    for (const field of formFields) {
      if (!isFieldVisible(field)) continue;
      allTouched.add(field.id);
      const error = validateField(field, values[field.id]);
      if (error) newErrors[field.id] = error;
    }
    setTouched(allTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setInternalSubmitting(true);
    setTimeout(() => {
      setInternalSubmitting(false);
      onSubmit?.(values);
    }, 800);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--token-space-2) var(--token-space-3)',
    fontSize: 'var(--token-text-sm)',
    fontFamily: 'var(--token-font-sans)',
    border: '1px solid var(--token-border)',
    borderRadius: 'var(--token-radius-md)',
    background: 'var(--token-bg)',
    color: 'var(--token-text-primary)',
    outline: 'none',
    transition: 'border-color var(--token-duration-fast)',
  };

  const completedCount = formFields.filter(f => isFieldVisible(f) && values[f.id] && String(values[f.id]).trim()).length;
  const visibleCount = formFields.filter(f => isFieldVisible(f)).length;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col"
      style={{
        fontFamily: 'var(--token-font-sans)',
        border: '1px solid var(--token-border)',
        borderRadius: 'var(--token-radius-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col"
        style={{
          padding: 'var(--token-space-4)',
          gap: 'var(--token-space-2)',
          borderBottom: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--token-space-2)' }}>
            {aiGenerated && (
              <Sparkles size={13} style={{ color: 'var(--token-accent)', flexShrink: 0 }} />
            )}
            <span
              style={{
                fontSize: 'var(--token-text-sm)',
                fontWeight: 'var(--token-weight-semibold)',
                color: 'var(--token-text-primary)',
              }}
            >
              {title}
            </span>
            {aiGenerated && (
              <DSBadge variant="ai" style={{ fontSize: 'var(--token-text-2xs)' }}>AI Generated</DSBadge>
            )}
          </div>
          {/* Progress indicator */}
          <span
            style={{
              fontSize: 'var(--token-text-2xs)',
              color: completedCount === visibleCount ? 'var(--token-success)' : 'var(--token-text-disabled)',
              fontFamily: 'var(--token-font-mono)',
              transition: 'color var(--token-duration-fast)',
            }}
          >
            {completedCount}/{visibleCount} filled
          </span>
        </div>
        {description && (
          <span
            style={{
              fontSize: 'var(--token-text-xs)',
              color: 'var(--token-text-tertiary)',
              lineHeight: 'var(--token-leading-normal)',
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* Fields */}
      <div
        className="flex flex-col"
        style={{
          padding: 'var(--token-space-4)',
          gap: 'var(--token-space-4)',
        }}
      >
        {formFields.map((field, idx) => {
          if (!isFieldVisible(field)) return null;
          const hasError = errors[field.id];
          const isTouched = touched.has(field.id);
          const isValid = isTouched && !hasError && values[field.id] && String(values[field.id]).trim();

          return (
            <div
              key={field.id}
              className="flex flex-col"
              style={{
                gap: 'var(--token-space-1-5)',
                animation: `token-fade-in 200ms ease ${idx * 40}ms both`,
              }}
            >
              <label className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: 'var(--token-space-1)' }}>
                  <span
                    style={{
                      fontSize: 'var(--token-text-xs)',
                      fontWeight: 'var(--token-weight-medium)',
                      color: hasError ? 'var(--token-error)' : 'var(--token-text-secondary)',
                      transition: 'color var(--token-duration-fast)',
                    }}
                  >
                    {field.label}
                  </span>
                  {field.required && (
                    <span style={{ color: 'var(--token-error)', fontSize: 'var(--token-text-xs)' }}>*</span>
                  )}
                  {isValid && (
                    <Check size={12} style={{ color: 'var(--token-success)' }} />
                  )}
                </div>
                {/* AI suggestion button */}
                {field.aiSuggestion && !values[field.id] && (
                  <button
                    type="button"
                    onClick={() => applySuggestion(field.id, field.aiSuggestion!)}
                    className="flex items-center cursor-pointer"
                    style={{
                      gap: 'var(--token-space-1)',
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-accent)',
                      fontFamily: 'var(--token-font-mono)',
                    }}
                  >
                    <Sparkles size={10} />
                    AI suggest
                  </button>
                )}
              </label>

              {field.type === 'text' && (
                <DSInput
                  value={(values[field.id] as string) || ''}
                  onChange={(e) => updateValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  state={hasError ? 'error' : undefined}
                />
              )}

              {field.type === 'number' && (
                <DSInput
                  type="number"
                  value={(values[field.id] as number) || ''}
                  onChange={(e) => updateValue(field.id, Number(e.target.value))}
                  placeholder={field.placeholder}
                  style={{ fontFamily: 'var(--token-font-mono)' }}
                  state={hasError ? 'error' : undefined}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={(values[field.id] as string) || ''}
                  onChange={e => updateValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: 72,
                    borderColor: hasError ? 'var(--token-error)' : 'var(--token-border)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = hasError ? 'var(--token-error)' : 'var(--token-accent)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = hasError ? 'var(--token-error)' : 'var(--token-border)'; }}
                />
              )}

              {field.type === 'select' && (
                <DSSelect
                  options={field.options || []}
                  value={(values[field.id] as string) || ''}
                  onChange={(v) => updateValue(field.id, v)}
                />
              )}

              {field.type === 'toggle' && (
                <DSToggle
                  checked={!!(values[field.id] as boolean)}
                  onChange={() => updateValue(field.id, !(values[field.id] as boolean))}
                />
              )}

              {/* Error message */}
              {hasError && (
                <div
                  className="flex items-center"
                  style={{
                    gap: 'var(--token-space-1)',
                    animation: 'token-fade-in 150ms ease',
                  }}
                >
                  <AlertCircle size={11} style={{ color: 'var(--token-error)', flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: 'var(--token-text-2xs)',
                      color: 'var(--token-error)',
                    }}
                  >
                    {errors[field.id]}
                  </span>
                </div>
              )}

              {field.description && !hasError && (
                <span
                  style={{
                    fontSize: 'var(--token-text-2xs)',
                    color: 'var(--token-text-disabled)',
                    lineHeight: 'var(--token-leading-normal)',
                  }}
                >
                  {field.description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit -- uses DSButton atom */}
      <div
        style={{
          padding: 'var(--token-space-3) var(--token-space-4)',
          borderTop: '1px solid var(--token-border)',
          background: 'var(--token-bg-secondary)',
        }}
      >
        <DSButton
          type="submit"
          variant="primary"
          icon={isSubmitting ? <Loader2 size={13} style={{ animation: 'token-spin 1s linear infinite' }} /> : <Send size={13} />}
          disabled={isSubmitting || Object.keys(errors).length > 0}
          style={{ width: '100%' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </DSButton>
      </div>
    </form>
  );
}

const defaultFields: FormField[] = [
  {
    id: 'topic',
    label: 'Report Topic',
    type: 'text',
    placeholder: 'e.g. Q4 Revenue Analysis',
    required: true,
    aiSuggestion: 'Q4 2025 Revenue Analysis',
    validation: { minLength: 3, message: 'Topic must be at least 3 characters' },
  },
  {
    id: 'format',
    label: 'Format',
    type: 'select',
    options: ['Executive Summary', 'Full Report', 'Slide Deck', 'One-Pager'],
    required: true,
    description: 'Choose the output format for your report.',
  },
  {
    id: 'depth',
    label: 'Detail Level',
    type: 'select',
    options: ['High-level Overview', 'Moderate Detail', 'Deep Analysis'],
  },
  {
    id: 'notes',
    label: 'Additional Notes',
    type: 'textarea',
    placeholder: 'Any specific areas to focus on...',
    aiSuggestion: 'Focus on year-over-year growth metrics and regional breakdown.',
  },
  {
    id: 'charts',
    label: 'Include Charts',
    type: 'toggle',
    defaultValue: true,
    description: 'Auto-generate data visualizations.',
  },
  {
    id: 'chart-type',
    label: 'Chart Style',
    type: 'select',
    options: ['Bar', 'Line', 'Pie', 'Area'],
    dependsOn: { field: 'charts', value: true },
    description: 'Only visible when charts are enabled.',
  },
];

export function DynamicFormDemo() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--token-space-8)',
            border: '1px solid var(--token-border)',
            borderRadius: 'var(--token-radius-lg)',
            gap: 'var(--token-space-3)',
            animation: 'token-fade-in 300ms ease',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 40, height: 40,
              borderRadius: 'var(--token-radius-full)',
              background: 'var(--token-success-light)',
            }}
          >
            <Send size={16} style={{ color: 'var(--token-success)' }} />
          </div>
          <span style={{
            fontSize: 'var(--token-text-sm)',
            color: 'var(--token-text-secondary)',
            fontFamily: 'var(--token-font-sans)',
          }}>
            Report generation started
          </span>
          <span style={{
            fontSize: 'var(--token-text-xs)',
            color: 'var(--token-text-disabled)',
            fontFamily: 'var(--token-font-mono)',
          }}>
            Estimated: ~2 minutes
          </span>
          <DSButton variant="outline" onClick={() => setSubmitted(false)} style={{ fontSize: 'var(--token-text-xs)' }}>
            Reset Demo
          </DSButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      <DynamicForm
        description="I'll generate a report based on your inputs. Fill in the details below."
        onSubmit={() => setSubmitted(true)}
      />
    </div>
  );
}
