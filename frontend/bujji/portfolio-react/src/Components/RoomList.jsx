import React from 'react';
import { Table, Button, Space } from 'antd';

const columns = [
  {
    title: 'Room Number',
    dataIndex: 'roomNumber',
    key: 'roomNumber',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Rent',
    dataIndex: 'rent',
    key: 'rent',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button>Edit</Button>
        <Button>Delete</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    roomNumber: '101',
    type: 'Single',
    status: 'Vacant',
    rent: '5000',
  },
  {
    key: '2',
    roomNumber: '102',
    type: 'Double',
    status: 'Occupied',
    rent: '8000',
  },
];

const RoomList = () => (
  <div>
    <h2>Room Management</h2>
    <Button type="primary" style={{ marginBottom: 16 }}>Add Room</Button>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default RoomList;
