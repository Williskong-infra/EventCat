import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/verify-email', values);
      message.success('Email verified successfully! You can now log in.');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '64px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <h2>Email Verification</h2>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ email: initialEmail }}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> 
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Verification Code" name="code" rules={[{ required: true, message: 'Please enter the code sent to your email' }]}> 
          <Input placeholder="Enter verification code" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Verify Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyEmail; 