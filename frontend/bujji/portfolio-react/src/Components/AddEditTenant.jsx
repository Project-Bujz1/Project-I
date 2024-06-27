import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';

const { Option } = Select;

const AddEditTenant = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Handle form submission, e.g., send data to the backend
  };

  return (
    <div>
      <h2>Add/Edit Tenant</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Tenant Name"
          rules={[{ required: true, message: 'Please enter tenant name' }]}
        >
          <Input placeholder="Enter tenant name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter tenant email' }]}
        >
          <Input placeholder="Enter tenant email" />
        </Form.Item>

        <Form.Item
          name="roomNumber"
          label="Room Number"
          rules={[{ required: true, message: 'Please select room number' }]}
        >
          <Select placeholder="Select room number">
            <Option value="101">101</Option>
            <Option value="102">102</Option>
            <Option value="103">103</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="rent"
          label="Rent Amount"
          rules={[{ required: true, message: 'Please enter rent amount' }]}
        >
          <Input placeholder="Enter rent amount" />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditTenant;
