import "./LoadingPage.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function LoadingPage() {
  return (
    <Box className="loadingWrapper">
      <CircularProgress />
    </Box>
  );
}
