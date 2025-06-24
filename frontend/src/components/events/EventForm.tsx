import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, InputNumber, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import path from 'path';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const getImageUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) : undefined;

const EventForm = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();

    if (id) {
      axios.get(`/api/events/${id}`).then(res => {
        const { title, date, location, imageUrl, price } = res.data;
        form.setFieldsValue({
          title,
          date: dayjs(date),
          location,
          imageUrl,
          price,
        });
        setImageUrl(imageUrl);
      });
    }
  }, [id, form]);

  const handleUpload = async ({ file }: { file: File }) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.imageUrl);
      setImageFile(file);
      form.setFieldsValue({ imageUrl: res.data.imageUrl });
      message.success('Image uploaded!');
    } catch (err) {
      message.error('Image upload failed');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values: any) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const payload = {
      ...values,
      date: values.date ? values.date.toISOString() : undefined,
      imageUrl,
    };
    if (id) {
      await axios.put(`/api/events/${id}`, payload, config);
      message.success('Event updated!');
      navigate(`/events/${id}`);
    } else {
      const res = await axios.post('/api/events', payload, config);
      message.success('Event created!');
      navigate(`/events/${res.data.id}`);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 500, margin: '0 auto' }}>
      <Form.Item label="Event Image" name="imageUrl">
        <Upload
          name="image"
          listType="picture-card"
          showUploadList={false}
          customRequest={handleUpload}
          accept="image/*"
        >
          {imageUrl ? (
            <img src={getImageUrl(imageUrl)} alt="event" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}> 
        <Input placeholder="Event title" />
      </Form.Item>
      <Form.Item label="Description" name="description"> 
        <Input.TextArea placeholder="Event description" />
      </Form.Item>
      <Form.Item label="Date and Time" name="date" rules={[{ required: true, message: 'Please select date and time' }]}> 
        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter a location' }]}> 
        <Input placeholder="Location" />
      </Form.Item>
      <Form.Item label="Price (HK$)" name="price"> 
        <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g. 150" />
      </Form.Item>
      <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]}>
        <select>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? 'Update Event' : 'Create Event'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventForm; 