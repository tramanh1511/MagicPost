import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Box,
  Autocomplete,
  Grid,
  TableSortLabel,
  Paper,
  Typography,
  Snackbar,
  Pagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShipmentDialog from "../Dialog/ShipmentDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB, updateDataFromFireStoreAndDexie, addDataToDexieTable, syncDexieToFirestore } from "../../database/cache";
import { changeDateForm, changeDateForm2, AutocompleteInput, formatDeliveryTime } from "../utils";

function createDataOrder({
  id,
  date,
  type,
  weight,
  senderName,
  senderPhone,
  senderAddress,
  receiverName,
  receiverPhone,
  receiverAddress,
  cost,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status,
}) {
  return {
    id,
    date: changeDateForm(date),
    type,
    weight,
    senderName,
    senderPhone,
    senderAddress,
    receiverName,
    receiverPhone,
    receiverAddress,
    cost,
    startGDpoint,
    startTKpoint,
    endTKpoint,
    endGDpoint,
    startGDpointName,
    startTKpointName,
    endTKpointName,
    endGDpointName,
    status,
  };
}

const TKShipment = () => {
  const orderHistories = useLiveQuery(() =>
    dexieDB
      .table("orderHistory")
      .filter((item) => item.historyID.endsWith('2'))
      .toArray()
  );
  const TKSystem = useLiveQuery(() =>
    dexieDB
      .table("TKsystem")
      .toArray()
  );
  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.startTKpoint === 'TK01' && item.endTKpoint !== 0)
      .toArray()
  );
  const dataShipments = useLiveQuery(() =>
    dexieDB
      .table("shipment")
      .filter((item) => item.startTKPoint === 'TK01' && item.startTKPoint !== 0)
      .toArray()
  );
  const NVTKacc = useLiveQuery(() =>
    dexieDB
      .table("NVTKacc")
      .filter((row) => row.tk === "Hà Nội")
      .toArray());
      
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (orderHistories && dataOrders && TKSystem) {
      // Tạo map từ orderHistory
      const orderHistoryDateMap = new Map(
        orderHistories.map(item => [item.orderID, item.date])
      );
      // Tạo map từ TKSystem
      const TKSystemNameMap = new Map(
        TKSystem.map(item => [item.id, item.name])
      );
      // Cập nhật orders dựa trên dataOrders và map
      const updatedOrders = dataOrders.map(order => {
        const orderHistoryDate = orderHistoryDateMap.get(order.id);
        const endTKPointName = TKSystemNameMap.get(order.endTKpointName);
        return ({
          ...createDataOrder(order),
          endTKpointName: endTKPointName,
          date: changeDateForm(orderHistoryDate)
        });
      });
      setOrders(updatedOrders);
    }
  }, [orderHistories, dataOrders, TKSystem]);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openCreateShipment, setOpenCreateShipment] = useState(false);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [selectedTKPoint, setSelectedTKPoint] =
    useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };
  const clickCreateShipment = () => {
    setOpenCreateShipment(true);
  };

  const handleConfirmShipment = async (confirmedOrders) => {
    try {
      setOrders(prevOrders => {
        return prevOrders.map(order => ({
          ...order,
          status: selectedOrders.includes(order.id) ? "Đã tạo đơn" : order.status
        }));
      });
      setSelectedOrders([]);
      setOpenCreateShipment(false);
      setOpenSnackbar(true);

    //  // Update orderHistories: Set description and status for historyID ending with '2'
    // Tạo 1 hàng mới trong orderHistory với historyID là orderID_2 
      // const updatedHistoriesPromises = orderHistories.map(history => {
      //   if (selectedOrders.includes(history.orderID)) {
      //     const updatedHistory = {
      //       historyID: systemData.historyID,
      //       orderID: systemData.orderID,
      //         date: systemData.date,
      //         currentLocation : systemData.currentLocation,
      //         Description: systemData.Description,
      //         orderStatus: systemData.orderStatus,
          
      //       Description: "Chuyển đến điểm tập kết nhận",
      //       currentLocation: orders.find(order => selectedOrders.includes(order.id))?.endTKpoint,
      //       status: "Đã tạo đơn",
      //     };
      //     const newHistoryID = `${history.orderID}_2`;
      //     return updateDataFromFireStoreAndDexie("orderHistory", newHistoryID, updatedHistory);
      //   }
      // });

      // // Wait for all history updates to complete
      // await Promise.all(updatedHistoriesPromises);

      // // Create a new shipment
      const newShipment = {
        shipmentID: 'S300',// orderCode tạo bên shipmentDialog
        counts: selectedOrders.length,
        details: selectedOrders.join(','),
        date: formatDeliveryTime(new Date()),
        startGDPoint: 0,
        startTKPoint: 'TK01',
        endTKPoint: orders.find(order => selectedOrders.includes(order.id))?.endTKpoint,
        endGDpoint: 0,
      };

      // console.log("new shipmnet", newShipment);

      // Add to dexieDB for shipment
      // await addDataToFireStoreAndDexie("shipment", newShipment);

      // Update orders status in the state
      setOrders(prevOrders => {
        return prevOrders.map(order => ({
          ...order,
          status: selectedOrders.includes(order.id) ? "Đã tạo đơn" : order.status
        }));
      });

      // Clear selected orders and close the dialog
      setSelectedOrders([]);
      setOpenCreateShipment(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating database: ", error);
    }
  };

const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackbar(false);
};

const closeCreateShipment = () => {
  setOpenCreateShipment(false);
  setSelectedOrders([]);
};

const orderIDs = orders.map(order => ({ label: order.id }));
const TKPoints = [
  { label: "Bà Rịa - Vũng Tàu" },
  { label: "Bắc Ninh" },
  { label: "Bình Định" },
  { label: "Bình Dương" },
  { label: "Cần Thơ" },
  { label: "Đà Nẵng" },
  { label: "Đắk Lắk" },
  { label: "Đồng Nai" },
  { label: "Hà Nội" },
  { label: "Hà Tĩnh" },
  { label: "Hải Dương" },
  { label: "Hải Phòng" },
  { label: "Hồ Chí Minh" },
  { label: "Huế" },
  { label: "Khánh Hòa" },
  { label: "Ninh Thuận" },
  { label: "Quảng Ngãi" },
  { label: "Thái Nguyên" },
  { label: "Vĩnh Phúc" },
  { label: "Ninh Bình" },
  { label: "Thái Bình" }
];

const year = [
  { label: 2023 },
  { label: 2022 },
  { label: 2021 },
  { label: 2020 },
];
const status = [{ label: "Chưa tạo đơn" }, { label: "Đã tạo đơn" }];
const createArray = (start, end) => {
  let array = [];
  for (let i = start; i <= end; i++) {
    let object = { label: i };
    array.push(object);
  }
  return array;
};
const month = createArray(1, 12);
const date = createArray(1, 31);

const handleTKPointChange = (event, value) => {
  setSelectedTKPoint(value);
};
const handleDateChange = (event, value) => {
  setSelectedDate(value);
};
const handleMonthChange = (event, value) => {
  setSelectedMonth(value);
};
const handleYearChange = (event, value) => {
  setSelectedYear(value);
};
const handleStatusChange = (event, value) => {
  setSelectedStatus(value);
};
const handleOrderIDChange = (event, value) => {
  setSelectedOrderID(value);
};

// Log the selected orders state
useEffect(() => {
  console.log("Selected Orders:", selectedOrders);
}, [selectedOrders]);

const handleCheckboxChange = (orderId) => {
  setSelectedOrders(prevSelectedOrders => {
    if (prevSelectedOrders.includes(orderId)) {
      return prevSelectedOrders.filter(id => id !== orderId);
    } else {
      return [...prevSelectedOrders, orderId];
    }
  });
};

const filteredOrders = orders.filter((order) => {
  const formattedDeliveryTime = formatDeliveryTime(order.date);
  return (
    (!selectedOrderID || order.id === selectedOrderID.label) &&
    (!selectedTKPoint ||
      ((order.endTKpoint) && (order.endTKpointName === selectedTKPoint.label))) &&
    (!selectedDate || formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
    (!selectedMonth || formattedDeliveryTime.getMonth() + 1 === parseInt(selectedMonth.label)) &&
    (!selectedYear || formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
    (!selectedStatus ||
      (order.confirmed ? "Đã tạo đơn" : "Chưa tạo đơn") === selectedStatus.label)
  );
});

const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
// Sorting function
const sortData = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'des';
  }
  setSortConfig({ key, direction });
};
const getSortedData = (data) => {
  if (!sortConfig.key) return data;
  return [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

return (
  <Container maxWidth="lg">
    <Box sx={{ paddingTop: '20px' }}>
      <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
        {[
          { label: "Mã đơn hàng", options: orderIDs, value: selectedOrderID, onChange: handleOrderIDChange },
          { label: "Điểm tập kết", options: TKPoints, value: selectedTKPoint, onChange: handleTKPointChange },
          { label: "Ngày", options: date, value: selectedDate, onChange: handleDateChange },
          { label: "Tháng", options: month, value: selectedMonth, onChange: handleMonthChange },
          { label: "Năm", options: year, value: selectedYear, onChange: handleYearChange },
          { label: "Trạng thái", options: status, value: selectedStatus, onChange: handleStatusChange, minWidth: '200px' },
        ].map((inputProps, index) => (
          <Grid item xs={12} sm={6} md={2} lg={2} key={index}>
            <AutocompleteInput {...inputProps} />
          </Grid>
        ))}
      </Grid>
    </Box>

    <Table>
      <TableHead>
        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
          <TableCell>
            <Checkbox
              checked={selectedOrders.length === orders.length}
              onChange={() => {
                const allSelected = selectedOrders.length === orders.length;
                setSelectedOrders(allSelected ? [] : orders.map((order) => order.id));
              }}
            />
          </TableCell>
          <TableCell>
            <strong>Mã đơn hàng</strong>
            <TableSortLabel
              active={sortConfig.key === 'id'}
              direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
              onClick={() => sortData('id')}
            />
          </TableCell>
          <TableCell>
            <strong>Thời gian</strong>
            <TableSortLabel
              active={sortConfig.key === 'date'}
              direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
              onClick={() => sortData('date')}
            />
          </TableCell>
          <TableCell>
            <strong>Đến điểm tập kết</strong>
            <TableSortLabel
              active={sortConfig.key === 'endTKpoint'}
              direction={sortConfig.key === 'endTKpoint' ? sortConfig.direction : 'asc'}
              onClick={() => sortData('endTKpoint')}
            />
          </TableCell>
          <TableCell><strong>Chi tiết</strong></TableCell>
          <TableCell>
            <strong>Trạng thái</strong>
            <TableSortLabel
              active={sortConfig.key === 'status'}
              direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
              onClick={() => sortData('status')}
            />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {getSortedData(filteredOrders)
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((order) => (
            <TableRow
              key={order.id}
              sx={{
                backgroundColor: order.status === "Đã tạo đơn" ? "#e8f5e9" : "inherit",
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />

              </TableCell>

              <TableCell>{order.id}</TableCell>
              {/* <TableCell>{order.type}</TableCell>
              <TableCell>{order.weight}</TableCell> */}
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.endTKpointName}</TableCell>
              <TableCell>
                <IconButton onClick={() => clickDetailOrder(order)} style={{ color: '#4CAF50' }}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>

    <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
      <Pagination
        count={Math.ceil(filteredOrders.length / rowsPerPage)}
        page={page + 1}
        onChange={(event, newPage) => setPage(newPage - 1)}
      />
    </Box>

    <Box mt={2} mb={2}>
      <Buttonme title="Tạo đơn" onClick={clickCreateShipment} />
    </Box>

    <ShipmentDialog
      open={openCreateShipment}
      onClose={closeCreateShipment}
      onConfirm={handleConfirmShipment}
      orders={orders.filter(order => selectedOrders.includes(order.id))}
      NVTKacc={NVTKacc}
    />
    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      message="Đã tạo đơn thành công"
    />

    <OrderDetailsDialog
      open={openDetailsOrder}
      onClose={closeDetailsOrder}
      order={selectedOrderDetails}
    />

  </Container>

);
}

export default TKShipment;