import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

const CARDS_PER_PAGE = 4;

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
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
    <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>Upcoming Events</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{ marginRight: 16 }}
        />
        <Row gutter={24} style={{ flex: 1 }}>
          {visibleEvents.map((event) => (
            <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, minHeight: 260 }}
                bodyStyle={{ padding: 18 }}
                title={<Link to={`/events/${event.id}`}>{event.title}</Link>}
              >
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.location}</p>
              </Card>
            </Col>
          ))}
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