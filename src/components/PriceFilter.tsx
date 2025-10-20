import React, { useState } from "react";
import { Box, Slider, Input, Button, Modal, Typography } from "@mui/material";

interface PriceFilterProps {
  open: boolean;
  onClose: () => void;
  minDefault?: number;
  maxDefault?: number;
  onApply: (minPrice: number, maxPrice: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  open,
  onClose,
  minDefault = 0,
  maxDefault = 2000000,
  onApply,
}) => {
  const [values, setValues] = useState<[number, number]>([minDefault, maxDefault]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSliderChange = (_: any, newValue: number | number[]) => {
    setValues(newValue as [number, number]);
  };

  const handleInputChange = (idx: 0 | 1, value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ""));
    const newValues = [...values] as [number, number];
    newValues[idx] = num;
    setValues(newValues);
  };

  const handleBlur = () => {
    if (values[0] < minDefault) {
      setValues([minDefault, values[1]]);
    }
    if (values[1] > maxDefault) {
      setValues([values[0], maxDefault]);
    }
    if (values[0] > values[1]) {
      setValues([values[1], values[1]]);
    }
  };

  const handleReset = () => setValues([minDefault, maxDefault]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        bgcolor="#1a1f2b"
        boxShadow={24}
        p={4}
        borderRadius={2}
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          minWidth: 300,
        }}
      >
        <Typography className="text-[#FFF]" gutterBottom variant="subtitle1">
          Price Range
        </Typography>
        <Slider
          value={values}
          onChange={handleSliderChange}
          min={minDefault}
          max={maxDefault}
          step={10000}
          valueLabelDisplay="auto"
        />
        <Box display="flex" gap={2} alignItems="center" pt={2}>
          <Input
          style={{color: '#FFF'}}
            value={values[0]}
            size="small"
            type="number"
            onChange={(e) => handleInputChange(0, e.target.value)}
            onBlur={handleBlur}
            inputProps={{ min: minDefault, max: values[1] }}
            placeholder="Min Price"
            startAdornment={<span>$</span>}
          />
          <span className="text-[#000]">-</span>
          <Input
          style={{color: '#FFF'}}
            value={values[1]}
            size="small"
            type="number"
            onChange={(e) => handleInputChange(1, e.target.value)}
            onBlur={handleBlur}
            inputProps={{ min: values[0], max: maxDefault }}
            placeholder="Max Price"
            startAdornment={<span>$</span>}
          />
        </Box>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button  variant="text" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" onClick={() => { onApply(values[0], values[1]); onClose(); }}>
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PriceFilter;
