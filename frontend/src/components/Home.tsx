import React from 'react';
import EventList from './events/EventList';

const Home = () => {
  return (
    <div>
      <h1>Welcome to EventCat</h1>
      <p>The best place to manage your events.</p>
      <EventList />
    </div>
  );
};

export default Home; 