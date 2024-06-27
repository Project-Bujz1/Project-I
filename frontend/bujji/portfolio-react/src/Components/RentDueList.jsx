import React from 'react';
import { Table, Button, Space } from 'antd';

const columns = [
  {
    title: 'Tenant Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Room Number',
    dataIndex: 'roomNumber',
    key: 'roomNumber',
  },
  {
    title: 'Rent Due',
    dataIndex: 'rentDue',
    key: 'rentDue',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button>Mark as Paid</Button>
        <Button>Send Reminder</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Doe',
    roomNumber: '101',
    rentDue: '5000',
    dueDate: '2024-06-30',
  },
  {
    key: '2',
    name: 'Jane Smith',
    roomNumber: '102',
    rentDue: '8000',
    dueDate: '2024-06-25',
  },
];

const RentDueList = () => (
  <div>
    <h2>Rent Due List</h2>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default RentDueList;
