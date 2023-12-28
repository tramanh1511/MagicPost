// CustomTable.js
import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, IconButton, TableSortLabel } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomTable = ({ rows, columns, handleCheckboxChange, handleDetailClick, handleSort, sortConfig }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id}>
              {column.label}
              {column.sortable && (
                <TableSortLabel
                  active={sortConfig.key === column.id}
                  direction={sortConfig.key === column.id ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort(column.id)}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} hover>
            {columns.map((column) => (
              <TableCell key={column.id}>
                {column.id === "details" ? (
                  <IconButton onClick={() => handleDetailClick(row)}>
                    <VisibilityIcon />
                  </IconButton>
                ) : column.id === "checkbox" ? (
                  <Checkbox
                    checked={row.checked}
                    onChange={() => handleCheckboxChange(row)}
                  />
                ) : (
                  row[column.id]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
