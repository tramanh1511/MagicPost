import React, { useState, useEffect } from "react";
import {
  AppBar,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  Box,
  Autocomplete,
  Card,
  CardContent,
  Input,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  ListItemText,
  List,
  ListItem,
  Divider,
  TableContainer,
  Tab,
  TableSortLabel,
  Grid,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Pagination from '@mui/material/Pagination';
import ShipmentDetailsDialog from "../Dialog/ShipmentDetailsDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import ShipmentTable from "../Table/ShipmentTable";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB, updateDataFromFireStoreAndDexie, updateDataFromDexieTable, addDataToFireStoreAndDexie, addDataToDexieTable, syncDexieToFirestore } from "../../database/cache";
import { AutocompleteInput, changeDateForm, formatDeliveryTime } from "../utils";
import { or } from "firebase/firestore";

function createData({
  id,
  date,
  counts,
  ordersList,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status
}) {
  return {
    id,
    date: changeDateForm(date),
    counts,
    ordersList,
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

const TKConfirm = () => {
  const dataShipments = useLiveQuery(() =>
    dexieDB
      .table("shipment")
      .filter((item) => item.endTKpoint === 'TK01' && item.startTKpoint)
      .toArray()
  );
  console.log("shipment", dataShipments);
  const orderHistories = useLiveQuery(() =>
    dexieDB
      .table("orderHistory")
      .filter((item) => item.historyID.endsWith('3'))
      .toArray()
  );
  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.endTKpoint === 'TK01' && item.startTKpoint)
      .toArray()
  )
  const TKSystem = useLiveQuery(() =>
    dexieDB
      .table("TKsystem")
      .toArray());
  const NVTKacc = useLiveQuery(() =>
      dexieDB
        .table("NVTKacc")
        .toArray())

  const [shipments, setShipments] = useState([]);
  useEffect(() => {
    if (TKSystem && dataShipments) {
      // Tạo map từ TKSystem
      const TKSystemNameMap = new Map(
        TKSystem.map(item => [item.id, item.name])
      );
      // Cập nhật shipments dựa trên map
      const updatedShipments = dataShipments.map(shipment => {
        const startTKPointName = TKSystemNameMap.get(shipment.startTKpoint);
        return {
          ...createData(shipment),
          startTKpointName: startTKPointName,
        };
      });
      setShipments(updatedShipments);
    }
  }, [TKSystem, dataShipments]);

  const [openDetailsShipment, setOpenDetailsShipment] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectedShipmentDetails, setSelectedShipmentDetails] = useState(null);
  const [selectedTKPoint, setSelectedTKPoint] =
    useState(null);
  const [selectedShipmentID, setSelectedShipmentID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentShipment, setCurrentShipment] = useState(null);

  const clickDetailsShipment = (shipment) => {
    if (shipment) {
      setCurrentShipment(shipment);
      setOpenDetailsShipment(true);
    } else {
      console.log('Attempted to open details for a null shipment');
    }
  };

  const closeDetailsShipment = () => {
    setOpenDetailsShipment(false);
    setCurrentShipment(null); // Xóa currentShipment khi đóng Dialog
  };

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);

  const handleCheckboxChange = (params) => {
    const newSelectedShipments = selectedShipments.includes(params)
      ? selectedShipments.filter((id) => id !== params)
      : [...selectedShipments, params];

    setSelectedShipments(newSelectedShipments);
  };

  // const handleConfirmShipment = async () => {
  //   const updatedShipments = shipments.map((shipment) =>
  //     selectedShipments.includes(shipment.id) && shipment.status === "chưa xác nhận"
  //       ? { ...shipment, status: "đã xác nhận" }
  //       : shipment
  //   );
  //   setShipments(updatedShipments);

  //   // Update dexieDB for shipments
  //   for (const shipment of updatedShipments) {
  //     if (selectedShipments.includes(shipment.id)) {
  //       try {
  //         await dexieDB.table("shipment").update(shipment.id, { status: "đã xác nhận" });
  //         // Split the ordersList of the current shipment
  //         if(!shipment) return;
  //         const orderIDs = shipment.ordersList.split(",");
  //         for (const orderID of orderIDs) {
  //           const historyID = `${orderID}_3`;
  //           try {
  //             await orderHistories.update(historyID, {
  //               Description: "Chuyển đến điểm tập kết đích",
  //               currentLocation: "Thanh Xuân",
  //               orderStatus: "Đã xác nhận",
  //             });
  //           } catch (error) {
  //             console.error("Error updating order history:", error);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error updating shipment in DexieDB:", error);
  //       }
  //     }
  //   }

  //   Promise.all(orderHistories).then(() => {
  //     console.log("Đã cập nhật DexieDB thành công!");
  //   });

  //   // Clear selected shipments
  //   setSelectedShipments([]);
  // };

  const handleConfirmShipment = async () => {
    // Update shipment status
    // for (const shipmentId of selectedShipments) {
    //   const updatedShipmentData = { status: "đã xác nhận" };
    //   await updateDataFromFireStoreAndDexie("shipment", shipmentId, updatedShipmentData);
    // }
  
    // Update order histories
    // const updateHistoriesPromises = selectedShipments.flatMap(shipmentId => {
    //   const shipment = shipments.find(s => s.id === shipmentId);
    //   return shipment.ordersList.split(",").map(orderId => {
    //     const historyId = `${orderId}_3`;
    //     const updatedHistoryData = {
    //       Description: "Chuyển đến điểm tập kết đích",
    //       currentLocation: "Thanh Xuân",
    //       orderStatus: "Đã xác nhận",
    //     };
    //     return updateDataFromFireStoreAndDexie("orderHistory", historyId, updatedHistoryData);
    //   });
    // });
  
    // Wait for all updates to complete
    // await Promise.all(updateHistoriesPromises);
  
    console.log("Đã cập nhật DexieDB thành công!");
  
    // Sync updated data to Firestore
    // syncDexieToFirestore("shipment", "shipments", ["status"]);
    // syncDexieToFirestore("orderHistory", "orderHistories", ["Description", "currentLocation", "orderStatus"]);
  
    // Update local state
    const updatedShipments = shipments.map((shipment) =>
      selectedShipments.includes(shipment.id)
        ? { ...shipment, status: "đã xác nhận" }
        : shipment
    );
    setShipments(updatedShipments);
  
    // Clear selected shipments
    setSelectedShipments([]);
  };
  
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
  const shipmentIDList = shipments.map(shipment => ({ label: shipment.id }));
  const status = shipments.map(shipment => ({ label: shipment.status }));
  const year = [
    { label: 2023 },
    { label: 2022 },
    { label: 2021 },
    { label: 2020 },
  ];
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

  const handleShipmentIDChange = (event, value) => {
    setSelectedShipmentID(value);
  }
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

  const filteredShipments = shipments.filter((shipment) => {
    const formattedDeliveryTime = formatDeliveryTime(shipment.date);
    return (
      (!selectedShipmentID ||
        shipment.id === selectedShipmentID.label) &&
      (!selectedTKPoint ||
        (shipment.startTKpoint && (shipment.startTKpointName === selectedTKPoint.label))) &&
      (!selectedDate || formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth || formattedDeliveryTime.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear || formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus ||
        (shipment.confirmed ? "đã xác nhận" : "chưa xác nhận") === selectedStatus.label)
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
    <Container>
      <Box sx={{ paddingTop: '20px' }}>
        <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
          {[
            { label: "Đơn chuyển hàng", options: shipmentIDList, value: selectedShipmentID, onChange: handleShipmentIDChange },
            { label: "Điểm giao dịch", options: TKPoints, value: selectedTKPoint, onChange: handleTKPointChange },
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
          <TableRow style={{ backgroundColor: '#f5f5f5' }} >
            <TableCell>
              <Checkbox
                checked={selectedShipments.length === shipments.length}
                onChange={() => {
                  const allSelected = selectedShipments.length === shipments.length;
                  setSelectedShipments(allSelected ? [] : shipments.map((shipment) => shipment.id));
                }}
              />
            </TableCell >
            <TableCell>
              <strong>Mã đơn chuyển hàng</strong>
              <TableSortLabel
                active={sortConfig.key === 'id'}
                direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('id')}
              />
            </TableCell>
            <TableCell>
              <strong>Thời gian chuyển đến</strong>
              <TableSortLabel
                active={sortConfig.key === 'date'}
                direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('date')}
              />
            </TableCell>
            <TableCell>
              <strong>Số lượng</strong>
              <TableSortLabel
                active={sortConfig.key === 'counts'}
                direction={sortConfig.key === 'counts' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('counts')}
              />
            </TableCell>
            <TableCell>
              <strong>Từ điểm tập kết</strong>
              <TableSortLabel
                active={sortConfig.key === 'startTKpoint'}
                direction={sortConfig.key === 'startTKpoint' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('startTKpoint')}
              />
            </TableCell>
            <TableCell>
              <strong>Chi tiết</strong>
            </TableCell>
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
          {getSortedData(filteredShipments)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((shipment) => (
              <TableRow
                key={shipment.id}
                sx={{
                  backgroundColor: shipment.status === "đã xác nhận" ? "#e8f5e9" : "inherit",
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedShipments.includes(shipment.id)}
                    onChange={() => handleCheckboxChange(shipment.id)}
                  />
                </TableCell>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell>{shipment.counts}</TableCell>
                <TableCell>{shipment.startTKpointName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => clickDetailsShipment(shipment)} style={{ color: '#4CAF50' }}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{shipment.status}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredShipments.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => setPage(newPage - 1)}
        />
      </Box>

      <Box mt={2} mb={2}>
        <Buttonme title="Xác nhận" onClick={handleConfirmShipment} />
      </Box>

      <ShipmentDetailsDialog
        open={openDetailsShipment}
        onClose={closeDetailsShipment}
        shipment={currentShipment}
        orders={dataOrders}
        staff={NVTKacc}
        clickDetailOrder={clickDetailOrder}
      />

      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        selectedOrderDetails={selectedOrderDetails}
      />
    </Container>
  );
};

export default TKConfirm;