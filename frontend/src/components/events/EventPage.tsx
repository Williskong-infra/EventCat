import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from 'antd/es/card';
import { Typography, Button, Space, Modal, message } from 'antd';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  location: string;
  price?: number;
  organizer: {
    id: string;
    name: string;
  };
  category: {
    name: string;
  };
  images?: { url: string }[];
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
        // Debug: log user and organizer IDs
        console.log('Current user.id:', user.id);
        console.log('Event organizer.id:', res.data.organizer?.id);
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

  // Prepare images for gallery
  const images = event.images && event.images.length > 0 ? event.images.map(img => getImageUrl(img.url)) : [];
  const mainImg = images[0];
  const sideImg1 = images[1] || images[0];
  const sideImg2 = images[2] || images[1] || images[0];

  return (
    <div style={{ maxWidth: 1000, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Typography.Title level={1} style={{ marginBottom: 24 }}>{event.title}</Typography.Title>
      {/* Gallery */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 2, minWidth: 0 }}>
          {mainImg && (
            <img src={mainImg} alt="main" style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }} />
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sideImg1 && (
            <img src={sideImg1} alt="side1" style={{ width: '100%', height: 156, objectFit: 'cover', borderRadius: 12 }} />
          )}
          {sideImg2 && (
            <img src={sideImg2} alt="side2" style={{ width: '100%', height: 156, objectFit: 'cover', borderRadius: 12 }} />
          )}
        </div>
      </div>
      {/* Details and Price in two columns */}
      <div style={{ display: 'flex', gap: 32, marginTop: 16, flexWrap: 'wrap' }}>
        {/* Left: Details */}
        <div style={{ flex: 2, minWidth: 260, textAlign: 'left' }}>
          <Typography.Paragraph>
            <strong>Organized by:</strong> {event.organizer.name}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Category:</strong> {event.category.name}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Period:</strong> {event.startDate && event.endDate ? `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}` : 'N/A'}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Location:</strong> {event.location}
          </Typography.Paragraph>
        </div>
        {/* Right: Price and Add to Cart */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ borderRadius: 12, textAlign: 'center', background: '#fafafa', boxShadow: '0 2px 8px #f0f1f2', padding: 24 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {event.price !== undefined ? `HK$ ${event.price}` : 'Free'}
            </Typography.Title>
            <Button type="primary" size="large" style={{ marginTop: 16, width: '100%' }}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      {/* Description below */}
      <div style={{ marginTop: 16 }}>
        <Typography.Paragraph>{event.description}</Typography.Paragraph>
      </div>
      {/* Organizer controls at end of page */}
      {user && user.id === event.organizer.id && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Space>
            <Link to={`/events/${event.id}/edit`}>
              <Button type="primary">Edit</Button>
            </Link>
            <Button type="primary" danger loading={loading} onClick={handleDelete}>
              Delete
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default EventPage; 