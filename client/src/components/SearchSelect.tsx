import { Autocomplete, TextField } from "@mui/material";

export function SearchSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "All",
  allowCreate = false,
  helperText,
  required = false,
  size = "medium",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id?: string; label: string }>;
  placeholder?: string;
  allowCreate?: boolean;
  helperText?: string;
  required?: boolean;
  size?: "small" | "medium";
}) {
  const selected = options.find((option) => option.label === value) || (value ? { label: value } : null);
  return (
    <Autocomplete
      freeSolo={allowCreate}
      openOnFocus
      options={options}
      value={selected}
      inputValue={value}
      onInputChange={(_, next) => onChange(next)}
      onChange={(_, next) => {
        if (typeof next === "string") onChange(next);
        else onChange(next?.label || "");
      }}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
      isOptionEqualToValue={(option, selectedValue) => option.label === selectedValue.label}
      noOptionsText={allowCreate ? "Type a new value to add it." : "Nothing to select yet."}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} helperText={helperText} required={required} size={size} />
      )}
    />
  );
}
