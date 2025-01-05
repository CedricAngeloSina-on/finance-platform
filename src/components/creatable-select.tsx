/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useMemo } from "react";
import { type SingleValue } from "react-select";
import { default as Select } from "react-select/creatable";

import { cn } from "~/lib/utils";

type CreatableSelectProps = {
  onChange: (value: string) => void;
  onCreateOption: (value: string) => void;
  options: { label: string; value: string }[];
  value: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

/**
 * styles that aligns with shadcn/ui
 */
const controlStyles = {
  base: "flex !min-h-9 w-full rounded-md border border-input bg-transparent pl-3 py-1 pr-1 gap-1 text-sm shadow-sm transition-colors hover:cursor-pointer",
  focus: "outline-none ring-1 ring-ring",
  disabled: "cursor-not-allowed opacity-50",
};
const placeholderStyles = "text-sm text-muted-foreground";
const valueContainerStyles = "gap-1";
const multiValueStyles =
  "inline-flex items-center gap-2 rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
const indicatorsContainerStyles = "gap-1";
const clearIndicatorStyles = "p-1 rounded-md";
const indicatorSeparatorStyles = "bg-border";
const dropdownIndicatorStyles = "p-1 rounded-md";
const menuStyles =
  "p-1 mt-1 border bg-popover shadow-md rounded-md text-popover-foreground";
const groupHeadingStyles =
  "py-2 px-1 text-secondary-foreground text-sm font-semibold";
const optionStyles = {
  base: "hover:cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-sm !text-sm !cursor-default !select-none !outline-none font-sans",
  focus: "active:bg-accent/90 bg-accent text-accent-foreground",
  disabled: "pointer-events-none opacity-50",
  selected: "",
};
const noOptionsMessageStyles =
  "text-accent-foreground p-2 bg-accent border border-dashed border-border rounded-sm";
const loadingIndicatorStyles =
  "flex items-center justify-center h-4 w-4 opacity-50";
const loadingMessageStyles = "text-accent-foreground p-2 bg-accent";

const createClassNames = (classNames: any) => {
  return {
    clearIndicator: (state: any) =>
      cn(clearIndicatorStyles, classNames?.clearIndicator?.(state)),
    container: (state: any) => cn(classNames?.container?.(state)),
    control: (state: any) =>
      cn(
        controlStyles.base,
        state.isDisabled && controlStyles.disabled,
        state.isFocused && controlStyles.focus,
        classNames?.control?.(state),
      ),
    dropdownIndicator: (state: any) =>
      cn(dropdownIndicatorStyles, classNames?.dropdownIndicator?.(state)),
    group: (state: any) => cn(classNames?.group?.(state)),
    groupHeading: (state: any) =>
      cn(groupHeadingStyles, classNames?.groupHeading?.(state)),
    indicatorsContainer: (state: any) =>
      cn(indicatorsContainerStyles, classNames?.indicatorsContainer?.(state)),
    indicatorSeparator: (state: any) =>
      cn(indicatorSeparatorStyles, classNames?.indicatorSeparator?.(state)),
    input: (state: any) => cn(classNames?.input?.(state)),
    loadingIndicator: (state: any) =>
      cn(loadingIndicatorStyles, classNames?.loadingIndicator?.(state)),
    loadingMessage: (state: any) =>
      cn(loadingMessageStyles, classNames?.loadingMessage?.(state)),
    menu: (state: any) => cn(menuStyles, classNames?.menu?.(state)),
    menuList: (state: any) => cn(classNames?.menuList?.(state)),
    menuPortal: (state: any) => cn(classNames?.menuPortal?.(state)),
    multiValue: (state: any) =>
      cn(multiValueStyles, classNames?.multiValue?.(state)),
    multiValueLabel: (state: any) => cn(classNames?.multiValueLabel?.(state)),
    multiValueRemove: (state: any) => cn(classNames?.multiValueRemove?.(state)),
    noOptionsMessage: (state: any) =>
      cn(noOptionsMessageStyles, classNames?.noOptionsMessage?.(state)),
    option: (state: any) =>
      cn(
        optionStyles.base,
        state.isFocused && optionStyles.focus,
        state.isDisabled && optionStyles.disabled,
        state.isSelected && optionStyles.selected,
        classNames?.option?.(state),
      ),
    placeholder: (state: any) =>
      cn(placeholderStyles, classNames?.placeholder?.(state)),
    singleValue: (state: any) => cn(classNames?.singleValue?.(state)),
    valueContainer: (state: any) =>
      cn(valueContainerStyles, classNames?.valueContainer?.(state)),
  };
};

const defaultClassNames = createClassNames({});

export function CreatableSelect({
  onChange,
  onCreateOption,
  options = [],
  value,
  disabled,
  placeholder,
}: CreatableSelectProps) {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value ?? "");
  };

  const formmatedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <Select
      unstyled
      onChange={onSelect}
      onCreateOption={onCreateOption}
      options={options}
      classNames={defaultClassNames}
      value={formmatedValue}
      isDisabled={disabled}
      placeholder={placeholder}
    />
  );
}
