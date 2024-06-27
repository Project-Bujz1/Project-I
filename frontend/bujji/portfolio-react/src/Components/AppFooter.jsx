import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => (
  <Footer style={{ backgroundColor: "#001529", color: "#fff" }}>
    <Row justify="space-around" align="middle">
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Follow Us</Title>
          <div style={{ fontSize: "24px" }}>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", margin: "0 10px" }}
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", margin: "0 10px" }}
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", margin: "0 10px" }}
            >
              <TwitterOutlined />
            </a>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Contact Us</Title>
          <div>
            <Text style={{ color: "#fff" }}>
              <MailOutlined /> hostel@example.com
            </Text>
          </div>
          <div>
            <Text style={{ color: "#fff" }}>
              <PhoneOutlined /> +91 90300 62699
            </Text>
          </div>
          <div>
            <Text style={{ color: "#fff" }}>Address:</Text>
            <Text style={{ color: "#fff" }}>
              MVP Main Rd, Sector 10, MVP Colony,
            </Text>
            <Text style={{ color: "#fff" }}>
              Visakhapatnam, Andhra Pradesh 530017
            </Text>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Facilities</Title>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>AC Rooms</li>
            <li>Kitchen</li>
            <li>24 Hours Water Supply</li>
            <li>Corporate Accommodation</li>
          </ul>
        </div>
      </Col>
    </Row>
  </Footer>
);

export default AppFooter;
