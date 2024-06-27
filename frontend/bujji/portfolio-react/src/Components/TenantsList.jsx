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
    title: 'Rent Status',
    dataIndex: 'rentStatus',
    key: 'rentStatus',
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
        <Button>Edit</Button>
        <Button>Delete</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Doe',
    roomNumber: '101',
    rentStatus: 'Paid',
    dueDate: '2024-06-30',
  },
  {
    key: '2',
    name: 'Jane Smith',
    roomNumber: '102',
    rentStatus: 'Unpaid',
    dueDate: '2024-06-25',
  },
];

const TenantsList = () => (
  <div>
    <h2>Tenants Management</h2>
    <Button type="primary" style={{ marginBottom: 16 }}>Add Tenant</Button>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default TenantsList;
