import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const AddComplaint = ({ onComplaintSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    onComplaintSubmit(values);
    form.resetFields();
  };

  return (
    <div>
      <h2>Add Complaint</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
          name="complaint"
          label="Complaint"
          rules={[{ required: true, message: 'Please describe the complaint' }]}
        >
          <Input.TextArea placeholder="Describe the complaint" />
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

export default AddComplaint;
