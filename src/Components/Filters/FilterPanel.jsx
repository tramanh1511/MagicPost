// FilterPanel.js
import React from "react";
import { Grid, TextField, Autocomplete } from "@mui/material";

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <Grid container spacing={2}>
      {filters.map((filter) => (
        <Grid item key={filter.key} xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            id={filter.key}
            options={filter.options}
            value={filter.selected}
            onChange={(event, newValue) => onFilterChange(filter.key, newValue)}
            renderInput={(params) => <TextField {...params} label={filter.label} />}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FilterPanel;
