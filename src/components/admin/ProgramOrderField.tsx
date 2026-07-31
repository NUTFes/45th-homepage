"use client";

import {
  DraggableSortable,
  DraggableSortableItem,
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
  useForm,
  useFormFields,
  useTranslation,
} from "@payloadcms/ui";
import { GripVertical } from "lucide-react";
import type { ArrayFieldClientComponent, FormField } from "payload";

const getRelationshipLabel = (value: unknown) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  if ("adminLabel" in value && typeof value.adminLabel === "string" && value.adminLabel) {
    return value.adminLabel;
  }

  if ("title" in value && typeof value.title === "string" && value.title) {
    return value.title;
  }

  return null;
};

const getRowLabel = (fields: Record<string, FormField>, path: string, index: number) => {
  const programLabel = fields[`${path}.${index}.programLabel`]?.value;
  if (typeof programLabel === "string" && programLabel) {
    return programLabel;
  }

  return getRelationshipLabel(fields[`${path}.${index}.program`]?.value);
};

export const ProgramOrderField: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  readOnly,
}) => {
  const { i18n } = useTranslation();
  const { moveFieldRow } = useForm();
  const {
    disabled,
    path,
    rows = [],
    showError,
  } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  });
  const rowLabels = useFormFields(([fields]) =>
    rows.map((_, index) => getRowLabel(fields, path, index)),
  );
  const isJapanese = i18n.language.startsWith("ja");
  const isDragDisabled = Boolean(readOnly || disabled || field.admin?.isSortable === false);

  return (
    <div
      className={[
        "array-field",
        "program-order-field",
        showError ? "array-field--has-error" : "array-field--has-no-error",
        field.admin?.className,
      ]
        .filter(Boolean)
        .join(" ")}
      id={`field-${path.replace(/\./g, "__")}`}
    >
      {showError ? <FieldError path={path} showError /> : null}
      <header className="array-field__header">
        <div className="array-field__header-wrap">
          <div className="array-field__header-content">
            <h3 className="array-field__title">
              <FieldLabel as="span" label={field.label} path={path} />
            </h3>
          </div>
        </div>
        <FieldDescription description={field.admin?.description} path={path} />
      </header>

      {rows.length > 0 ? (
        <DraggableSortable
          className="array-field__draggable-rows"
          ids={rows.map((row) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => {
            if (moveFromIndex !== moveToIndex) {
              moveFieldRow({ moveFromIndex, moveToIndex, path });
            }
          }}
        >
          {rows.map((row, index) => {
            const fallbackLabel = isJapanese
              ? `公開企画 ${index + 1}`
              : `Published program ${index + 1}`;
            const label = rowLabels[index] || fallbackLabel;
            const dragLabel = isJapanese ? `${label}を並べ替え` : `Reorder ${label}`;

            return (
              <DraggableSortableItem disabled={isDragDisabled} id={row.id} key={row.id}>
                {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
                  <div
                    ref={setNodeRef}
                    className={isDragging ? "program-order-field__row--dragging" : undefined}
                    style={{ transform, transition, zIndex: isDragging ? 1 : undefined }}
                  >
                    <div className="program-order-field__row">
                      <button
                        {...attributes}
                        {...listeners}
                        aria-label={dragLabel}
                        className="program-order-field__drag-handle"
                        disabled={isDragDisabled}
                        type="button"
                      >
                        <GripVertical aria-hidden size={18} />
                      </button>
                      <span className="program-order-field__label">{label}</span>
                    </div>
                  </div>
                )}
              </DraggableSortableItem>
            );
          })}
        </DraggableSortable>
      ) : (
        <p className="program-order-field__empty">
          {isJapanese
            ? "このカテゴリに公開中の企画はありません。"
            : "There are no published programs in this category."}
        </p>
      )}
    </div>
  );
};
