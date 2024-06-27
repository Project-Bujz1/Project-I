import React, { useState } from "react";
import { Layout, Menu, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "./App.css";
import About from "./Components/About";
import Dashboard from "./Components/Dashboard";
import RoomList from "./Components/RoomList";
import AddEditRoom from "./Components/AddEditRoom";
import TenantsList from "./Components/TenantsList";
import AddEditTenant from "./Components/AddEditTenant";
import RentDueList from "./Components/RentDueList";
import PaymentHistory from "./Components/PaymentHistory";
import ComplaintsList from "./Components/ComplaintsList";
import AddComplaint from "./Components/AddComplaint";
import Profile from "./Components/Profile";
import AppFooter from "./Components/AppFooter";

const { Header, Content, Footer } = Layout;

function App() {
  const [selectedRoute, setSelectedRoute] = useState("about");

  const renderContent = () => {
    switch (selectedRoute) {
      case "about":
        return <About />;
      case "dashboard":
        return <Dashboard />;
      case "rooms":
        return <RoomList />;
      case "addRoom":
        return <AddEditRoom />;
      case "tenants":
        return <TenantsList />;
      case "addTenant":
        return <AddEditTenant />;
      case "rentDue":
        return <RentDueList />;
      case "paymentHistory":
        return <PaymentHistory />;
      case "complaints":
        return <ComplaintsList />;
      case "addComplaint":
        return <AddComplaint />;
      case "search":
        return <About />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderRadius: "10px",
          overflow: "hidden",
          margin: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["about"]}
          onClick={({ key }) => setSelectedRoute(key)}
        >
          <Menu.Item
            key="about"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "about"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="dashboard"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "dashboard"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="rooms"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "rooms"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Rooms
          </Menu.Item>
          <Menu.Item
            key="addRoom"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "addRoom"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Add Room
          </Menu.Item>
          <Menu.Item
            key="tenants"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "tenants"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Tenants
          </Menu.Item>
          <Menu.Item
            key="addTenant"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "addTenant"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Add Tenant
          </Menu.Item>
          <Menu.Item
            key="rentDue"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "rentDue"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Rent Due
          </Menu.Item>
          <Menu.Item
            key="paymentHistory"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "paymentHistory"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Payment History
          </Menu.Item>
          <Menu.Item
            key="complaints"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "complaints"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Complaints
          </Menu.Item>
          <Menu.Item
            key="addComplaint"
            style={{
              fontSize: "18px",
              boxShadow:
                selectedRoute === "addComplaint"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
          >
            Add Complaint
          </Menu.Item>
          <Menu.Item
            key="search"
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              color: "black",
              marginLeft: "auto",
              boxShadow:
                selectedRoute === "search"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
            onClick={() => setSelectedRoute("search")}
          >
            <Input
              prefix={<SearchOutlined style={{ marginRight: "8px" }} />}
              placeholder="Search"
              style={{ width: "500px" }}
            />
          </Menu.Item>
          <Menu.Item
            key="profile"
            style={{
              fontSize: "18px",
              color: "black",
              boxShadow:
                selectedRoute === "profile"
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none",
            }}
            icon={<UserOutlined />}
            onClick={() => setSelectedRoute("profile")}
          >
            Profile
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">{renderContent()}</div>
      </Content>
      <AppFooter />
      <Footer style={{ textAlign: "center" }}>
        PG Hostel Management System ©2024
      </Footer>
    </Layout>
  );
}

export default App;
