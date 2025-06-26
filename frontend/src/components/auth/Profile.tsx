import React, { useState, useEffect } from 'react';
import { Avatar, Button, Input, Select, Form, Row, Col, message, Spin, Upload } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const initialProfile = {
  name: '',
  gender: '',
  country: '',
  language: '',
  timeZone: '',
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

// Helper to get full image URL
const getProfilePicUrl = (pic?: string) => {
  if (!pic) return undefined;
  if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
  // Assume relative path, serve from backend
  return `http://localhost:3001${pic}`;
};

const Profile = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: res.data.name || '',
          gender: res.data.gender || '',
          country: res.data.country || '',
          language: res.data.language || '',
          timeZone: res.data.timeZone || '',
        });
        setProfilePic(res.data.profilePic);
        form.setFieldsValue({
          name: res.data.name || '',
          gender: res.data.gender || '',
          country: res.data.country || '',
          language: res.data.language || '',
          timeZone: res.data.timeZone || '',
          profilePic: res.data.profilePic || '',
        });
      } catch (err) {
        message.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    form.setFieldsValue({ ...profile, profilePic });
    setEditing(false);
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/profile', { ...values, profilePic }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(values);
      setEditing(false);
      setProfilePic(values.profilePic || profilePic);
      localStorage.setItem('user', JSON.stringify({ ...profile, ...values, profilePic }));
      message.success('Profile updated!');
    } catch (err) {
      message.error('Failed to update profile');
    }
  };

  const handleUpload = async (info: any) => {
    if (info.file.status === 'uploading') return;
    if (info.file.status === 'done') {
      const url = info.file.response.imageUrl;
      setProfilePic(url);
      form.setFieldsValue({ profilePic: url });
      message.success('Profile picture uploaded!');
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', background: 'var(--card-bg)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={96}
            src={getProfilePicUrl(profilePic)}
            icon={!profilePic ? <UserOutlined /> : undefined}
            style={{
              marginRight: 32,
              border: '3px solid var(--color-primary)',
              background: 'var(--color-primary)',
              color: 'var(--color-neutral-dark)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-neutral-dark)' }}>{profile.name || 'Your Name'}</div>
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
      {editing && (
        <div style={{ marginBottom: 24 }}>
          <Upload
            name="image"
            action="/api/upload"
            showUploadList={false}
            onChange={handleUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
          </Upload>
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ...profile, profilePic }}
        disabled={!editing}
        style={{ marginBottom: 32 }}
      >
        <Form.Item name="profilePic" style={{ display: 'none' }}><Input /></Form.Item>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}> <Input placeholder="Your Name" /> </Form.Item>
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
    </div>
  );
};

export default Profile; 