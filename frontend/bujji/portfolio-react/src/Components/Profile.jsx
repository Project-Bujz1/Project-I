import React, { useState } from 'react';
import { Descriptions, Button, Modal, Form, Input } from 'antd';

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = (values) => {
    setProfileData(values);
    setIsModalVisible(false);
  };

  return (
    <div>
      <h2>Profile</h2>
      <Descriptions bordered>
        <Descriptions.Item label="Name">{profileData.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{profileData.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{profileData.phone}</Descriptions.Item>
      </Descriptions>
      <Button type="primary" onClick={showModal}>
        Edit Profile
      </Button>
      <Modal
        title="Edit Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={profileData}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
