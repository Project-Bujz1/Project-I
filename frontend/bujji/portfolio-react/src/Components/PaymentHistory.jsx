import React from 'react';
import { Table } from 'antd';

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
    title: 'Amount Paid',
    dataIndex: 'amountPaid',
    key: 'amountPaid',
  },
  {
    title: 'Payment Date',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
  },
];

const data = [
  {
    key: '1',
    name: 'John Doe',
    roomNumber: '101',
    amountPaid: '5000',
    paymentDate: '2024-06-01',
  },
  {
    key: '2',
    name: 'Jane Smith',
    roomNumber: '102',
    amountPaid: '8000',
    paymentDate: '2024-06-02',
  },
];

const PaymentHistory = () => (
  <div>
    <h2>Payment History</h2>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default PaymentHistory;
