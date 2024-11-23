import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Table, Popconfirm, message, Switch, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;  // Add this line

const ChargesManagement = () => {
  const [form] = Form.useForm();
  const [charges, setCharges] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${orgId}/charges.json`);
      const data = await response.json();
      if (data) {
        const chargesArray = Object.entries(data).map(([id, charge]) => ({
          id,
          ...charge
        }));
        setCharges(chargesArray);
      }
    } catch (error) {
      console.error('Error fetching charges:', error);
      message.error('Failed to fetch charges');
    }
  };

  const onFinish = async (values) => {
    try {
      const chargeData = {
        name: values.name,
        type: values.type,
        value: parseFloat(values.value),
        description: values.description || '',
        isEnabled: true
      };

      if (editingId) {
        // Update existing charge
        await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${orgId}/charges/${editingId}.json`, {
          method: 'PUT',
          body: JSON.stringify(chargeData)
        });
        message.success('Charge updated successfully');
      } else {
        // Add new charge
        await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${orgId}/charges.json`, {
          method: 'POST',
          body: JSON.stringify(chargeData)
        });
        message.success('Charge added successfully');
      }

      form.resetFields();
      setEditingId(null);
      fetchCharges();
    } catch (error) {
      console.error('Error saving charge:', error);
      message.error('Failed to save charge');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${orgId}/charges/${id}.json`, {
        method: 'DELETE'
      });
      message.success('Charge deleted successfully');
      fetchCharges();
    } catch (error) {
      console.error('Error deleting charge:', error);
      message.error('Failed to delete charge');
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
  };

  const handleToggleCharge = async (record, enabled) => {
    try {
      await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${orgId}/charges/${record.id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ isEnabled: enabled })
      });
      message.success(`${record.name} ${enabled ? 'enabled' : 'disabled'}`);
      fetchCharges();
    } catch (error) {
      console.error('Error toggling charge:', error);
      message.error('Failed to update charge status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => text === 'percentage' ? 'Percentage' : 'Fixed Amount'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => record.type === 'percentage' ? `${text}%` : `₹${text}`
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Enabled',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (_, record) => (
        <Switch
          checked={record.isEnabled}
          onChange={(checked) => handleToggleCharge(record, checked)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          style={{ 
            backgroundColor: record.isEnabled ? '#52c41a' : '#f5f5f5',
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this charge?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}>
      <Card 
        title="Manage Charges" 
        extra={
          <Text type="secondary">
            Toggle charges to apply them to bills
          </Text>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Charge Name"
            rules={[{ required: true, message: 'Please enter charge name' }]}
          >
            <Input placeholder="e.g., GST, Service Charge" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Charge Type"
            rules={[{ required: true, message: 'Please select charge type' }]}
          >
            <Select placeholder="Select charge type">
              <Option value="percentage">Percentage</Option>
              <Option value="fixed">Fixed Amount</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Please enter value' }]}
          >
            <Input type="number" step="0.01" placeholder="Enter value" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Optional description" />
          </Form.Item>

          <Form.Item
            name="isEnabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="Enabled" 
              unCheckedChildren="Disabled"
              defaultChecked 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update Charge' : 'Add Charge'}
            </Button>
            {editingId && (
              <Button 
                style={{ marginLeft: 8 }} 
                onClick={() => {
                  form.resetFields();
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            )}
          </Form.Item>
        </Form>

        <Table 
          columns={columns} 
          dataSource={charges}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default ChargesManagement; 