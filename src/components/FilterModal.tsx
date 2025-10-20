import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Input,
} from "@mui/material";

const bedroomOptions = ["Any", "1", "2", "3", "4", "5"];
const bathroomOptions = ["Any", "1", "2", "3", "4", "5"];

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    minPrice: number;
    maxPrice: number;
    bedrooms: string;
    bathrooms: string;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("2000000");
  const [bedrooms, setBedrooms] = useState<string>("Any");
  const [bathrooms, setBathrooms] = useState<string>("Any");

  const handlePriceSliderChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setPriceRange([min, max]);
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
  };

  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMinPriceInput(val);
    if (val === "") return;
    const numVal = Number(val);
    if (numVal <= priceRange[1]) {
      setPriceRange([numVal, priceRange[1]]);
    }
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMaxPriceInput(val);
    if (val === "") return;
    const numVal = Number(val);
    if (numVal >= priceRange[0]) {
      setPriceRange([priceRange[0], numVal]);
    }
  };

  const handleReset = () => {
    setPriceRange([0, 2000000]);
    setMinPriceInput("0");
    setMaxPriceInput("2000000");
    setBedrooms("Any");
    setBathrooms("Any");
  };

  const handleApply = () => {
    onApply({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      bedrooms,
      bathrooms,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        bgcolor="#1a1f2b"
        boxShadow={24}
        p={3}
        borderRadius={2}
        sx={{
          position: "absolute",
          top: { xs: 0, sm: "30%" },
          left: { xs: 0, sm: "50%" },
          transform: { xs: "none", sm: "translate(-50%, -30%)" },
          width: { xs: "100vw", sm: 360 },
          height: { xs: "100vh", sm: "auto" },
          borderRadius: { xs: 0, sm: 2 },
          overflowY: "auto",
          outline: "none",
        }}
      >
        {/* Price Filter */}
        <Typography className="text-[#FFF]" variant="subtitle1" gutterBottom>
          PRICE
        </Typography>
        <Slider
        sx={{
           "&.MuiSlider-root": {
            color: "#e6f1c6",
            
          },
        }}
          value={priceRange}
          onChange={handlePriceSliderChange}
          min={0}
          max={2000000}
          step={10000}
          valueLabelDisplay="auto"
        />
        <Box display="flex" gap={2} alignItems="center" pb={2}>
          <Input
          sx={{
            color: '#FFF',
            "&.MuiInput-root::after": {
             borderBottom: '1px solid #00bfa6'
             }, 
            "&.MuiInput-root::before": {
             borderBottom: '1px solid #e6f1c6'
             }
          }}
            value={minPriceInput}
            size="small"
            onChange={handleMinPriceInputChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            placeholder="Min Price"
            fullWidth
            startAdornment={<span>$</span>}
          />
          <Input
              sx={{
            color: '#FFF',
            "&.MuiInput-root::after": {
             borderBottom: '1px solid #00bfa6'
             }, 
            "&.MuiInput-root::before": {
             borderBottom: '1px solid #e6f1c6'
             }
          }}
            value={maxPriceInput}
            size="small"
            onChange={handleMaxPriceInputChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            placeholder="Max Price"
            fullWidth
            startAdornment={<span>$</span>}
          />
        </Box>

        {/* Beds & Baths */}
        <Typography className="text-[#FFF]" variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          BEDS: {bedrooms} / BATHS: {bathrooms}
        </Typography>

        <Typography className="text-[#FFF]" variant="subtitle1" gutterBottom>
          Bedrooms
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={bedrooms}
          onChange={(_, val) => val !== null && setBedrooms(val)}
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          {bedroomOptions.map((opt) => (
            <ToggleButton 
             key={opt} value={opt} sx={{ borderLeft: '1px solid transparent', border: '1px solid #e6f1c6', minWidth: 40,
                color: "#e6f1c6",
                "&:hover": {
                  backgroundColor: "#e6f1c6", // hover color
                  color: '#000'
                },
                "&.Mui-selected": {
                  backgroundColor: "#e6f1c6", // selected color (for ToggleButtons)
                  color: '#000',
                },
                // hover while selected
                "&.Mui-selected:hover": {
                  backgroundColor: "#e6f1c6",
                  color: '#000'
                },
              }}>
              {opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography className="text-[#FFF]" variant="subtitle1" gutterBottom>
          Bathrooms
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={bathrooms}
          onChange={(_, val) => val !== null && setBathrooms(val)}
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          {bathroomOptions.map((opt) => (
            <ToggleButton  key={opt} value={opt} sx={{ borderLeft: '1px solid transparent', border: '1px solid #e6f1c6', minWidth: 40,
                color: "#e6f1c6",
                "&:hover": {
                  backgroundColor: "#e6f1c6", // hover color
                  color: '#000'
                },
                "&.Mui-selected": {
                  backgroundColor: "#e6f1c6", // selected color (for ToggleButtons)
                  color: '#000',
                },
                // hover while selected
                "&.Mui-selected:hover": {
                  backgroundColor: "#e6f1c6",
                  color: '#000'
                },
              }}>
              {opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="text" sx={{ color: '#00bfa6'}} onClick={handleReset}>
            Reset All Filters
          </Button>
          <Button sx={{backgroundColor: '#00bfa6'}} variant="contained" onClick={handleApply}>
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
