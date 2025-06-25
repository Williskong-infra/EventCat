import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface Event {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  location: string;
  images?: { url: string }[];
  imageUrl?: string;
}

const CARDS_PER_PAGE = 4;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const getImageUrl = (url?: string) => url ? (url.startsWith('http') ? url : `${API_BASE_URL}${url}`) : undefined;

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('JWT token before request:', token);
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const maxPage = Math.max(0, Math.ceil(events.length / CARDS_PER_PAGE) - 1);
  const startIdx = page * CARDS_PER_PAGE;
  const visibleEvents = events.slice(startIdx, startIdx + CARDS_PER_PAGE);

  return (
    <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ marginBottom: 32, fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>Upcoming Events</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{ marginRight: 16 }}
        />
        <Row gutter={24} style={{ flex: 1 }}>
          {visibleEvents.map((event) => {
            // Get first image from images array, fallback to imageUrl
            const firstImg = event.images && event.images.length > 0 ? getImageUrl(event.images[0].url) : (event.imageUrl ? getImageUrl(event.imageUrl) : undefined);
            const period = event.startDate && event.endDate ? `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}` : '';
            return (
              <Col key={event.id} xs={24} sm={12} md={8} lg={6} xxl={6} style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                <div style={{
                  width: 275,
                  height: 380,
                  borderRadius: 16,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                }}>
                  {firstImg && (
                    <img
                      src={firstImg}
                      alt={event.title}
                      style={{ height: 160, width: '100%', objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                    />
                  )}
                  <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, letterSpacing: 0.2, lineHeight: 1.2, minHeight: 44 }}>
                      <Link to={`/events/${event.id}`}>{event.title}</Link>
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{period}</div>
                    <div style={{ color: '#888', marginBottom: 8, fontSize: 13, minHeight: 18 }}>{event.location}</div>
                    <Button type="primary" block style={{ marginTop: 'auto', fontSize: 15, height: 40 }}>
                      <Link to={`/events/${event.id}`}>Detail</Link>
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        <Button
          icon={<RightOutlined />}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
          disabled={page === maxPage}
          style={{ marginLeft: 16 }}
        />
      </div>
    </div>
  );
};

export default EventList; 