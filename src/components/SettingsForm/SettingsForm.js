import { Typography, Button, Box } from "@mui/material";

export default function SettingsForm({
  title,
  fields,
  onSubmit,
  buttonText = "Save"
}) {
  return (
    <Box className="settingsFormBox">
      <Typography className="changeText">{title}</Typography>
      {fields.map((field) => (
        <input
          key={field.name}
          placeholder={field.placeholder}
          type={field.type}
          value={field.value}
          onChange={field.onChange}
        />
      ))}
      <Button
        variant="contained"
        className="saveButton"
        onClick={onSubmit}
      >
        {buttonText}
      </Button>
    </Box>
  );
} 