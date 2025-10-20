import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const bedroomOptions = ["Any", "1", "2", "3", "4", "5"];
const bathroomOptions = ["Any", "1", "2", "3", "4", "5"];

interface BedsBathsModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (bedrooms: string, bathrooms: string) => void;
}

const BedsBathsModal: React.FC<BedsBathsModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [bedrooms, setBedrooms] = useState<string>("Any");
  const [bathrooms, setBathrooms] = useState<string>("Any");

  const handleReset = () => {
    setBedrooms("Any");
    setBathrooms("Any");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        bgcolor="#1a1f2b"
        p={4}
        borderRadius={2}
        boxShadow={24}
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          minWidth: 340,
        }}
      >
        <Typography className="text-[#FFF]" variant="subtitle1" gutterBottom>
          Bedrooms
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={bedrooms}
          onChange={(_, val) => val && setBedrooms(val)}
          sx={{ mb: 2, mt: 1 }}
        >
          {bedroomOptions.map((option) => (
            <ToggleButton key={option} value={option} sx={{ mx: 0.5 }}>
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography className="text-[#FFF]" variant="subtitle1" sx={{ mt: 2 }}>
          Bathrooms
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={bathrooms}
          onChange={(_, val) => val && setBathrooms(val)}
          sx={{ mb: 2, mt: 1 }}
        >
          {bathroomOptions.map((option) => (
            <ToggleButton key={option} value={option} sx={{ mx: 0.5 }}>
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="text" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onApply(bedrooms, bathrooms);
              onClose();
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BedsBathsModal;
