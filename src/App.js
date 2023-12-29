import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { dexieDB } from "./database/cache";
import { collection, onSnapshot } from "firebase/firestore";
import { fireAuth, fireDB } from "./database/firebase";
import Home from "./Pages/MainPage";
import DashBoard from "./Components/Navbar/Dashboard";
import { CssBaseline } from "@mui/material";
import ConfirmationFromTransactionPoint from "./Components/ConfirmationFromTransactionPoint";
import OrdersConfirm from "./Components/OrderConfirm";
import OrderStatus from "./Components/OrderStatus";
import GDConfirm from "./Components/Confirmation/GDConfirm";
import TKConfirm from "./Components/Confirmation/TKConnfirm";
import GDShipment from "./Components/Shipments/GDShipment";
import TKShipment from "./Components/Shipments/TKShipment";

const App = () => {
  const logPackageDataFromDexieDB = async () => {
    try {
      const packageData = await dexieDB.table("orderHistory").toArray();
      console.log("Dữ liệu từ bảng package trong DexieDB:", packageData);
    } catch (error) {
      console.error("Lỗi khi truy vấn dữ liệu từ DexieDB:", error);
    }
  };
  // useEffect(() => {
  //   logusersDataFromDexieDB();
  // })

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "GDsystem"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       // console.log("systemDA GDS", systemData);
  //       await dexieDB.table("GDsystem").put({
  //             id: systemData.id,
  //             name: systemData.name,
  //             manage : systemData.manage,
  //             hotline: systemData.hotline,
  //             email : systemData.email,
  //             address: systemData.address,
  //             setDay:systemData.setDay,
  //             coverArea: systemData.coverArea,
  //             TKpoint:systemData.TKpoint,
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "TKsystem"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       console.log("systemData tksys", systemData);
  //       await dexieDB.table("TKsystem").put({
  //             id: systemData.id,
  //             name: systemData.name,
  //             manage : systemData.manage,
  //             hotline: systemData.hotline,
  //             email : systemData.email,
  //             address: systemData.address,
  //             setDay:systemData.setDay,
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "LeadGDacc"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       await dexieDB.table("LeadGDacc").put({
  //             id: systemData.id,
  //             username: systemData.username,
  //             name: systemData.name,
  //             gd : systemData.gd,
  //             dob: systemData.dob,
  //             sex: systemData.sex,
  //             email : systemData.email,
  //             phone: systemData.phone,
  //             password: systemData.password
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "LeadTKacc"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       await dexieDB.table("LeadTKacc").put({
  //             id: systemData.id,
  //             username: systemData.username,
  //             name: systemData.name,
  //             tk : systemData.tk,
  //             dob: systemData.dob,
  //             sex: systemData.sex,
  //             email : systemData.email,
  //             phone: systemData.phone,
  //             password: systemData.password
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "NVTKacc"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       await dexieDB.table("NVTKacc").put({
  //             id: systemData.id,
  //             username: systemData.username,
  //             name: systemData.name,
  //             tk : systemData.tk,
  //             dob: systemData.dob,
  //             sex: systemData.sex,
  //             email : systemData.email,
  //             phone: systemData.phone,
  //             password: systemData.password
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "GDVacc"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       await dexieDB.table("GDVacc").put({
  //             id: systemData.id,
  //             username: systemData.username,
  //             name: systemData.name,
  //             gd : systemData.gd,
  //             dob: systemData.dob,
  //             sex: systemData.sex,
  //             email : systemData.email,
  //             phone: systemData.phone,
  //             password: systemData.password
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "orderHistory"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       console.log("orederHistory", systemData);
  //       await dexieDB.table("orderHistory").put({
  //             historyID: systemData.historyID,
  //             orderID: systemData.orderID,
  //             date: systemData.date,
  //             currentLocation : systemData.currentLocation,
  //             Description: systemData.Description,
  //             orderStatus: systemData.orderStatus,
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "orders"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       console.log("sysstem order", systemData);
  //       await dexieDB.table("orders").put({
  //             id: systemData.id,
  //             senderName: systemData.senderName,
  //             senderPhone: systemData.senderPhone,
  //             senderAddress: systemData.senderAddress,
  //             receiverName: systemData.receiverName,
  //             receiverPhone: systemData.receiverPhone,
  //             receiverAddress: systemData.receiverAddress,
  //             type: systemData.type,
  //             weight: systemData.weight,
  //             cost: systemData.cost,
  //             startGDpoint: systemData.startGDpoint,
  //             startTKpoint: systemData.startTKpoint,
  //             endTKpoint: systemData.endTKpoint,
  //             endGDpoint: systemData.endGDpoint,
  //             startGDpointName: systemData.startGDpoint,
  //             startTKpointName: systemData.startTKpoint,
  //             endTKpointName: systemData.endTKpoint,
  //             endGDpointName: systemData.endGDpoint,
  //             status: "Chưa tạo đơn",
  //             date: "",
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //   });
  //   return () => listener();
  // }, []);

  // useEffect(() => {
  //   const listener = onSnapshot(collection(fireDB, "shipment"), (snapshot) => {
  //     snapshot.docChanges().forEach(async (system) => {
  //       const systemDoc = system.doc;
  //       const systemData = systemDoc.data();
  //       console.log("systemData shipment", systemData);
  //       await dexieDB.table("shipment").put({
  //             id: systemData.shipmentID,
  //             date: systemData.createDate,
  //             counts: systemData.Counts,
  //             ordersList: systemData.details,
  //             startGDpoint: systemData.startGDpoint,
  //             startTKpoint: systemData.startTKpoint,
  //             endTKpoint: systemData.endTKpoint,
  //             endGDpoint: systemData.endGDpoint,
  //             startGDpointName: systemData.startGDpoint,
  //             startTKpointName: systemData.startTKpoint,
  //             endTKpointName: systemData.endTKpoint,
  //             endGDpointName: systemData.endGDpoint,
  //             status: systemData.status,          
  //           });
  //       return;
  //     });
  //     // logPackageDataFromDexieDB();
  //     // console.log("data from DexieDB: ", dexieDB.table("shipment").toArray());
  //   });
  //   return () => listener();
  // }, []);


  const navigate = useNavigate();
  // const onSignIn = () => navigate("/home");
  // const id = localStorage.getItem("id").slice(0,3);
  return (
    <>
      <div className="App">
        <CssBaseline />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<DashBoard />} />
          <Route path="/confirm-transactionPoint" element={<GDConfirm />} />
          <Route path="/confirm-gatheringPoint" element={<TKConfirm />} />
          <Route path="/transfer-transactionPoint" element={<GDShipment />} />
          <Route path="/transfer-gatheringPoint" element={<TKShipment />} />
          <Route path="/order-status" element={<OrderStatus />} />
          {/* <Route path="/create" element={<ConfirmationFrom} */}

          {/* <Route
            path="/home"
            element={
              id === "CEO" ? <HomeCEO /> : id === "LGD" ? <HomeGD /> : <HomeTK />
            }
          /> */}
          {/* <Route
            path="/statistic"
            element={
              id === "CEO" ? (
                <StatisticCEO />
              ) : id === "LGD" ? (
                <StatisticGD />
              ) : (
                <StatisticTK />
              )
            }
          />
          <Route
            path="/system"
            element={
              id === "CEO" ? <System /> : id === "LGD" ? <HomeGD /> : <HomeTK />
            }
          /> */}
          {/* <Route
            path="/account"
            element={
              id === "CEO" ? (
                <Account />
              ) : id === "LGD" ? (
                <HeadGDAccount />
              ) : (
                <HeadTKAccount />
              )
            }
          /> */}
        </Routes>
      </div>
    </>
  );
};

export default App;