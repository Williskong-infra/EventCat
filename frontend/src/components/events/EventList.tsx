import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

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

  return (
    <div>
      <h2>Upcoming Events</h2>
      <Link to="/create-event">Create New Event</Link>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 