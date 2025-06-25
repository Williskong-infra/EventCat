import React from 'react';
import EventList from './events/EventList';
import { Carousel } from 'antd';

const bannerData = [
  { src: '/media/city1.jpg', caption: 'Discover the City Life' },
  { src: '/media/city2.jpg', caption: 'Unforgettable Events Await' },
  { src: '/media/city3.jpg', caption: 'Experience the Best Venues' },
  { src: '/media/city4.jpg', caption: 'Create Memories with EventCat' },
];

const Home = () => {
  return (
    <>
      <div style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', overflow: 'hidden' }}>
        <Carousel autoplay style={{ marginBottom: 0 }}>
          {bannerData.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', width: '100vw', height: 480 }}>
              <img
                src={item.src}
                alt={`banner${idx + 1}`}
                style={{ width: '100vw', height: 480, objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 80,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0 64px 18px 64px',
                  fontSize: 32,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {item.caption}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <EventList />
      </div>
    </>
  );
};

export default Home; 