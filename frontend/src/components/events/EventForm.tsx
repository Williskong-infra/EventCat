import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    categoryId: '',
  });
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
      const fetchEvent = async () => {
        try {
          const res = await axios.get(`/api/events/${id}`);
          const { title, description, date, location, categoryId } = res.data;
          setFormData({ title, description, date: new Date(date).toISOString().slice(0, 16), location, categoryId });
        } catch (err) {
          console.error(err);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const { title, description, date, location, categoryId } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {
        // Update event
        await axios.put(`/api/events/${id}`, formData, config);
        navigate(`/events/${id}`);
      } else {
        // Create event
        const res = await axios.post('/api/events', formData, config);
        navigate(`/events/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={title} onChange={onChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange}></textarea>
        </div>
        <div>
          <label>Date and Time</label>
          <input type="datetime-local" name="date" value={date} onChange={onChange} required />
        </div>
        <div>
          <label>Location</label>
          <input type="text" name="location" value={location} onChange={onChange} required />
        </div>
        <div>
          <label>Category</label>
          <select name="categoryId" value={categoryId} onChange={onChange} required>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{id ? 'Update Event' : 'Create Event'}</button>
      </form>
    </div>
  );
};

export default EventForm; 