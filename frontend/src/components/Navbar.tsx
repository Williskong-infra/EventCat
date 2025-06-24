import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Grid } from 'antd';
import { HomeOutlined, AppstoreOutlined, PlusOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, InfoCircleOutlined, QuestionCircleOutlined, MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Determine selected menu item
  const selectedKey = () => {
    if (location.pathname.startsWith('/categories')) return 'categories';
    if (location.pathname.startsWith('/about')) return 'about';
    if (location.pathname.startsWith('/qa')) return 'qa';
    if (location.pathname.startsWith('/create-event')) return 'create-event';
    if (location.pathname.startsWith('/login')) return 'login';
    if (location.pathname.startsWith('/register')) return 'register';
    return 'home';
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Categories</Link>,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">About</Link>,
    },
    {
      key: 'qa',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/qa">Q&A</Link>,
    },
    ...(token
      ? [
          {
            key: 'create-event',
            icon: <PlusOutlined />,
            label: <Link to="/create-event">Create Event</Link>,
          },
        ]
      : []),
  ];

  const menu = (
    <Menu
      mode={screens.md ? 'horizontal' : 'vertical'}
      selectedKeys={[selectedKey()]}
      items={menuItems}
      style={screens.md ? { flex: 1, minWidth: 0, border: 'none', background: 'transparent' } : { border: 'none', background: 'transparent' }}
    />
  );

  return (
    <Header style={{ width: '100%', padding: 0, background: '#fff', boxShadow: '0 2px 8px #f0f1f2', zIndex: 10, position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: screens.md ? '0 32px' : '0 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#ff5b00', marginRight: 32, letterSpacing: 1, flexShrink: 0 }}>
          <Link to="/" style={{ color: '#ff5b00' }}>EventCat</Link>
        </div>
        {screens.md ? (
          <>
            {menu}
            {token ? (
              <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary" danger style={{ marginLeft: 16 }}>
                Logout
              </Button>
            ) : (
              <>
                <Button icon={<LoginOutlined />} type="primary" style={{ marginLeft: 16 }} onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button icon={<UserAddOutlined />} style={{ marginLeft: 8 }} onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button icon={<MenuOutlined />} type="text" onClick={() => setDrawerOpen(true)} style={{ marginLeft: 'auto', fontSize: 22 }} />
            <Drawer
              title={<span style={{ fontWeight: 700, fontSize: 22, color: '#ff5b00' }}>EventCat</span>}
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              bodyStyle={{ padding: 0 }}
            >
              {menu}
              <div style={{ padding: 16 }}>
                {token ? (
                  <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary" danger block>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button icon={<LoginOutlined />} type="primary" block style={{ marginBottom: 8 }} onClick={() => { setDrawerOpen(false); navigate('/login'); }}>
                      Login
                    </Button>
                    <Button icon={<UserAddOutlined />} block onClick={() => { setDrawerOpen(false); navigate('/register'); }}>
                      Register
                    </Button>
                  </>
                )}
              </div>
            </Drawer>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar; 