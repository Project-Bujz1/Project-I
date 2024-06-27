import React from 'react';
import { Table, Button, Space } from 'antd';

const columns = [
  {
    title: 'Room Number',
    dataIndex: 'roomNumber',
    key: 'roomNumber',
  },
  {
    title: 'Complaint',
    dataIndex: 'complaint',
    key: 'complaint',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button onClick={() => handleResolve(record.key)}>Resolve</Button>
        <Button onClick={() => handleDelete(record.key)}>Delete</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    roomNumber: '101',
    complaint: 'Leaking tap',
    status: 'Pending',
  },
  {
    key: '2',
    roomNumber: '102',
    complaint: 'Broken window',
    status: 'Resolved',
  },
];

const ComplaintsList = () => {

  const handleResolve = (key) => {
    console.log(`Resolving complaint with key: ${key}`);
    // Implement resolve logic here
  };

  const handleDelete = (key) => {
    console.log(`Deleting complaint with key: ${key}`);
    // Implement delete logic here
  };

  return (
    <div>
      <h2>Complaints Management</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>Add Complaint</Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ComplaintsList;
