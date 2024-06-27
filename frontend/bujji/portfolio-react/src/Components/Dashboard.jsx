import React from 'react';
import { Button, Descriptions, Card } from 'antd';

const Dashboard = () => (
  <div>
    <Card
      title="Dashboard"
      extra={<Button type="primary">Add Booking</Button>}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="Hostel Name">XYZ Hostel</Descriptions.Item>
        <Descriptions.Item label="Total Rooms">100</Descriptions.Item>
        <Descriptions.Item label="Available Rooms">20</Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

export default Dashboard;
