import React from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';

const { Option } = Select;

const AddEditRoom = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Handle form submission, e.g., send data to the backend
  };

  return (
    <div>
      <h2>Add/Edit Room</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="roomNumber"
          label="Room Number"
          rules={[{ required: true, message: 'Please enter room number' }]}
        >
          <Input placeholder="Enter room number" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Room Type"
          rules={[{ required: true, message: 'Please select room type' }]}
        >
          <Select placeholder="Select room type">
            <Option value="single">Single</Option>
            <Option value="double">Double</Option>
            <Option value="suite">Suite</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="vacant">Vacant</Option>
            <Option value="occupied">Occupied</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="rent"
          label="Rent"
          rules={[{ required: true, message: 'Please enter rent amount' }]}
        >
          <Input placeholder="Enter rent amount" />
        </Form.Item>

        <Form.Item
          name="images"
          label="Room Pictures"
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
          >
            <div>Upload</div>
          </Upload>
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

export default AddEditRoom;
