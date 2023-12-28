import React, { Fragment, useState } from "react";
import {
  CssBaseline,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import ThirdPanel from "../Components/MainPage/ThirdPanel";
import SecondPanel from "../Components/MainPage/SecondPanel";
import FirstPanel from "../Components/MainPage/FirstPanel/FirstPanel";
import Header from "../Components/MainPage/Header";
import Footer from "../Components/MainPage/Footer";

function App() {
  const [open, setOpen] = useState(false);
  const [orderCode, setOrderCode] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/order-status");
    // Xử lý logic tìm kiếm ở đây
    // <Link to="/orderStatus" />;
  };

  const handleSignIn = () => {
    // Xử lý logic đăng nhập ở đây
     navigate("/home");
  };

  return (
    <Fragment>
      <CssBaseline />
      <Header
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onSignIn={handleSignIn}
      />
      <FirstPanel
        onOrderCodeChange={(e) => setOrderCode(e.target.value)}
        onSearchClick={handleSearch}
      />
      <SecondPanel />
      <ThirdPanel />
      <Footer />
    </Fragment>
  );
}

export default App;


