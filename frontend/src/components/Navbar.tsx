import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Grid, Avatar } from 'antd';
import { HomeOutlined, AppstoreOutlined, PlusOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, InfoCircleOutlined, QuestionCircleOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';

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

  // Helper to get full image URL
  const getProfilePicUrl = (pic?: string) => {
    if (!pic) return undefined;
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    // Assume relative path, serve from backend
    return `http://localhost:3001${pic}`;
  };

  const user = localStorage.getItem('user');
  const userObj = user ? JSON.parse(user) : null;
  const profilePic = userObj?.profilePic;

  return (
    <Header style={{ width: '100%', padding: 0, background: '#fff', boxShadow: '0 2px 8px #f0f1f2', zIndex: 10, position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: screens.md ? '0 32px' : '0 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#ff5b00', marginRight: 32, letterSpacing: 1, flexShrink: 0 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#ff5b00', textDecoration: 'none' }}>
            <img src="/media/EventCat_logo.png" alt="EventCat Logo" style={{ height: 56, marginRight: 16 }} />
            <span style={{ display: 'none' }}>EventCat</span>
          </Link>
        </div>
        {screens.md ? (
          <>
            {React.cloneElement(menu, {
              style: { ...menu.props.style, color: 'var(--color-text)' },
              items: menuItems.map(item => ({
                ...item,
                label: (
                  <span style={{ color: location.pathname.startsWith(`/${item.key}`) || (item.key === 'home' && location.pathname === '/') ? 'var(--color-accent)' : 'var(--color-text)' }}>
                    {item.label}
                  </span>
                )
              }))
            })}
            {token ? (
              <>
                <Button
                  style={{ marginLeft: 16, borderRadius: '50%', padding: 0, width: 40, height: 40, background: 'var(--color-neutral-light)', border: '1px solid var(--color-neutral-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => navigate('/profile')}
                >
                  <Avatar
                    size={32}
                    src={getProfilePicUrl(profilePic)}
                    icon={!profilePic ? <UserOutlined /> : undefined}
                    style={{ background: 'var(--color-primary)', color: 'var(--color-neutral-dark)' }}
                  />
                </Button>
                <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary" danger style={{ marginLeft: 8 }}>
                  Logout
                </Button>
              </>
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
                  <>
                    <Button
                      style={{ marginBottom: 8, borderRadius: '50%', padding: 0, width: 40, height: 40, background: 'var(--color-neutral-light)', border: '1px solid var(--color-neutral-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => navigate('/profile')}
                    >
                      <Avatar
                        size={32}
                        src={getProfilePicUrl(profilePic)}
                        icon={!profilePic ? <UserOutlined /> : undefined}
                        style={{ background: 'var(--color-primary)', color: 'var(--color-neutral-dark)' }}
                      />
                    </Button>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout} type="primary" danger block>
                      Logout
                    </Button>
                  </>
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