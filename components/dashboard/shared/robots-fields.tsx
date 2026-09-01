"use client";

import { useState } from "react";

import { FieldError } from "@/components/shared/form-controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import {
  composeRobotsTags,
  parseRobotsUiState,
  type RobotsUiState,
  type RobotsValueState,
} from "@/lib/seo-robots";

interface RobotsFieldsProps {
  idPrefix: string;
  value: string;
  label: string;
  error?: string;
  onChange: (value: string) => void;
}

export function RobotsFields({ idPrefix, value, label, error, onChange }: RobotsFieldsProps) {
  const [state, setState] = useState<RobotsUiState>(() => parseRobotsUiState(value));

  function update(partial: Partial<RobotsUiState>) {
    const next = { ...state, ...partial };
    setState(next);
    onChange(composeRobotsTags(next));
  }

  function updateValue(key: "maxSnippet" | "maxVideoPreview", partial: Partial<RobotsValueState>) {
    update({ [key]: { ...state[key], ...partial } });
  }

  const l = TAXONOMY_LABELS;
  const robotsId = `${idPrefix}-seo-robots`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={robotsId} className="text-[13px] font-bold">
        {label}
      </Label>

      <div className="space-y-3 rounded-xl bg-muted/50 p-3 ring-1 ring-border/60">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${robotsId}-indexing`} className="text-[12px] font-bold text-muted-foreground">
              {l.seoRobotsIndexingLabel}
            </Label>
            <Select value={state.indexing} onValueChange={(value) => update({ indexing: value as RobotsUiState["indexing"] })}>
              <SelectTrigger id={`${robotsId}-indexing`} className="h-9 w-full rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index">index</SelectItem>
                <SelectItem value="noindex">noindex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${robotsId}-following`} className="text-[12px] font-bold text-muted-foreground">
              {l.seoRobotsFollowingLabel}
            </Label>
            <Select value={state.following} onValueChange={(value) => update({ following: value as RobotsUiState["following"] })}>
              <SelectTrigger id={`${robotsId}-following`} className="h-9 w-full rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow">follow</SelectItem>
                <SelectItem value="nofollow">nofollow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-[11px] font-bold text-muted-foreground">{l.seoRobotsAdvancedLabel}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${robotsId}-image`} className="text-[12px] font-bold text-muted-foreground">
              {l.seoRobotsImagePreviewLabel}
            </Label>
            <Select value={state.imagePreview} onValueChange={(value) => update({ imagePreview: value as RobotsUiState["imagePreview"] })}>
              <SelectTrigger id={`${robotsId}-image`} className="h-9 w-full rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{l.seoRobotsImageDefault}</SelectItem>
                <SelectItem value="large">{l.seoRobotsImageLarge}</SelectItem>
                <SelectItem value="standard">{l.seoRobotsImageStandard}</SelectItem>
                <SelectItem value="none">{l.seoRobotsImageNone}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <RobotsValueField
            id={`${robotsId}-snippet`}
            label={l.seoRobotsSnippetLabel}
            state={state.maxSnippet}
            onUpdate={(partial) => updateValue("maxSnippet", partial)}
          />

          <RobotsValueField
            id={`${robotsId}-video`}
            label={l.seoRobotsVideoLabel}
            state={state.maxVideoPreview}
            onUpdate={(partial) => updateValue("maxVideoPreview", partial)}
          />
        </div>
      </div>

      <p className="text-[11px] leading-5 text-muted-foreground">{l.seoRobotsHint}</p>
      <FieldError errorId={`${robotsId}-error`} message={error} />
    </div>
  );
}

interface RobotsValueFieldProps {
  id: string;
  label: string;
  state: RobotsValueState;
  onUpdate: (partial: Partial<RobotsValueState>) => void;
}

function RobotsValueField({ id, label, state, onUpdate }: RobotsValueFieldProps) {
  const l = TAXONOMY_LABELS;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[12px] font-bold text-muted-foreground">
        {label}
      </Label>
      <Select
        value={state.mode}
        onValueChange={(value) => onUpdate({ mode: value as RobotsValueState["mode"] })}
      >
        <SelectTrigger id={id} className="h-9 w-full rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">{l.seoRobotsValueDefault}</SelectItem>
          <SelectItem value="unlimited">{l.seoRobotsValueUnlimited}</SelectItem>
          <SelectItem value="custom">{l.seoRobotsValueCustom}</SelectItem>
        </SelectContent>
      </Select>
      {state.mode === "custom" ? (
        <Input
          dir="ltr"
          type="number"
          min={0}
          inputMode="numeric"
          value={state.value}
          placeholder={l.seoRobotsValueCustomPlaceholder}
          className="h-9 rounded-lg text-start"
          aria-label={label}
          onChange={(event) => onUpdate({ value: event.target.value })}
        />
      ) : null}
    </div>
  );
}
