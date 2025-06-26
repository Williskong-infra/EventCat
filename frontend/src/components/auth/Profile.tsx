import React, { useState } from 'react';
import { Avatar, Button, Input, Select, Form, Row, Col, message } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const initialProfile = {
  fullName: user.name || '',
  nickName: '',
  gender: '',
  country: '',
  language: '',
  timeZone: '',
  email: user.email || '',
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const countryOptions = [
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'China', label: 'China' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Other', label: 'Other' },
];
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Other', label: 'Other' },
];
const timeZoneOptions = [
  { value: 'GMT+8', label: 'GMT+8' },
  { value: 'GMT+9', label: 'GMT+9' },
  { value: 'GMT+0', label: 'GMT+0' },
  { value: 'Other', label: 'Other' },
];

const Profile = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setProfile(initialProfile);
    setEditing(false);
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Send to backend
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/profile', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(values);
      setEditing(false);
      localStorage.setItem('user', JSON.stringify({ ...user, name: values.fullName, email: values.email }));
      message.success('Profile updated!');
    } catch (err) {
      // Validation failed or request failed
      message.error('Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', background: 'var(--card-bg)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={72} icon={<UserOutlined />} style={{ marginRight: 24, background: 'var(--color-primary)', color: 'var(--color-neutral-dark)' }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-neutral-dark)' }}>{profile.fullName || 'Your Name'}</div>
            <div style={{ color: 'var(--color-text)', fontSize: 16 }}>{profile.email}</div>
          </div>
        </div>
        {editing ? (
          <div>
            <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} style={{ marginRight: 8 }}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <Button icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={profile}
        disabled={!editing}
        style={{ marginBottom: 32 }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name' }]}> <Input placeholder="Your First Name" /> </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Nick Name" name="nickName"> <Input placeholder="Your Nick Name" /> </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Gender" name="gender"> <Select options={genderOptions} placeholder="Select Gender" /> </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Country" name="country"> <Select options={countryOptions} placeholder="Select Country" /> </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Language" name="language"> <Select options={languageOptions} placeholder="Select Language" /> </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Time Zone" name="timeZone"> <Select options={timeZoneOptions} placeholder="Select Time Zone" /> </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ background: 'var(--color-neutral-light)', borderRadius: 8, padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>My email Address</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <MailOutlined style={{ color: 'var(--color-accent)', fontSize: 20, marginRight: 12 }} />
          <span style={{ fontSize: 16 }}>{profile.email}</span>
          <span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>1 month ago</span>
        </div>
        <Button type="dashed" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>+ Add Email Address</Button>
      </div>
    </div>
  );
};

export default Profile; 