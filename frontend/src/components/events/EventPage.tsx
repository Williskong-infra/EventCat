import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

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
}

const EventPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/events/${id}`, config);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{event.title}</h2>
      {user && user.id === event.organizer.id && (
        <div>
          <Link to={`/events/${event.id}/edit`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <p>
        <strong>Organized by:</strong> {event.organizer.name}
      </p>
      <p>
        <strong>Category:</strong> {event.category.name}
      </p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>{event.description}</p>
    </div>
  );
};

export default EventPage; 