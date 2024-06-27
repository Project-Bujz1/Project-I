import React from "react";
import { Typography, Row, Col, Card, Carousel } from "antd";
import No_Brokerage from "../assets/No_Brokerage.webp";

const { Title, Paragraph } = Typography;

const About = () => (
  <div>
    <div>
      <Carousel autoplay>
        <div>
          <h3
            style={{
              fontSize: "48px",
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              textShadow: "2px 2px 4px #000000",
              border: "2px solid rgba(0, 0, 0, 0.5)",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "10px",
              height: "700px",
              color: "#fff",
              lineHeight: "160px",
              textAlign: "center",
              backgroundImage: `url(${No_Brokerage})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            Sri Krishna Boys Hostel
          </h3>
        </div>
        <div>
          <h3
            style={{
              fontSize: "48px",
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              textShadow: "2px 2px 4px #000000",
              border: "2px solid rgba(0, 0, 0, 0.5)",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "10px",
              height: "700px",
              color: "#fff",
              lineHeight: "160px",
              textAlign: "center",
              backgroundImage: `url(${No_Brokerage})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            Best Facilities and Services
          </h3>
        </div>
        <div>
          <h3
            style={{
              fontSize: "48px",
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              textShadow: "2px 2px 4px #000000",
              border: "2px solid rgba(0, 0, 0, 0.5)",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "10px",
              height: "700px",
              color: "#fff",
              lineHeight: "160px",
              textAlign: "center",
              backgroundImage: `url(${No_Brokerage})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            Affordable and Comfortable
          </h3>
        </div>
      </Carousel>
    </div>
    <Row justify="center" style={{ marginTop: 20 }}>
      <Col span={16}>
        <Title level={1} style={{ textAlign: "center" }}>
          Welcome to Sri Krishna Boys PG Hostel
        </Title>
        <Paragraph style={{ textAlign: "center" }}>
          XYZ PG Hostel offers comfortable and affordable accommodation with all
          modern amenities. Located in the heart of the city, our PG is the
          perfect choice for students and professionals looking for a home away
          from home.
        </Paragraph>
        <Paragraph style={{ textAlign: "center" }}>
          <strong>Key Features:</strong>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li>Spacious rooms with attached bathrooms</li>
            <li>High-speed internet and power backup</li>
            <li>24/7 security and CCTV surveillance</li>
            <li>Delicious and hygienic meals</li>
            <li>Easy access to public transport and shopping centers</li>
          </ul>
        </Paragraph>
      </Col>
    </Row>
  </div>
);

export default About;
