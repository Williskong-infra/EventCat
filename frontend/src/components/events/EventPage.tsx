import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Modal, message } from 'antd';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    id: string;
    name: string;
  };
  category: {
    name: string;
  };
  imageUrl?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const getImageUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) : undefined;

const EventPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        message.error('Failed to fetch event');
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Delete this event?',
      content: 'Are you sure you want to delete this event?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.delete(`/api/events/${id}`, config);
          message.success('Event deleted!');
          navigate('/');
        } catch (err) {
          message.error('Failed to delete event');
        }
        setLoading(false);
      },
    });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      style={{ maxWidth: 600, margin: '32px auto', borderRadius: 12 }}
      cover={
        event.imageUrl && (
          <img
            src={getImageUrl(event.imageUrl)}
            alt={event.title}
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
          />
        )
      }
    >
      <Typography.Title level={2}>{event.title}</Typography.Title>
      {user && user.id === event.organizer.id && (
        <Space style={{ marginBottom: 16 }}>
          <Link to={`/events/${event.id}/edit`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button type="primary" danger loading={loading} onClick={handleDelete}>
            Delete
          </Button>
        </Space>
      )}
      <Typography.Paragraph>
        <strong>Organized by:</strong> {event.organizer.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Category:</strong> {event.category.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Location:</strong> {event.location}
      </Typography.Paragraph>
      <Typography.Paragraph>{event.description}</Typography.Paragraph>
    </Card>
  );
};

export default EventPage; 