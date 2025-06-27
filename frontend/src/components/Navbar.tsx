import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Grid, Avatar, InputNumber, Popconfirm, message } from 'antd';
import { HomeOutlined, AppstoreOutlined, PlusOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, InfoCircleOutlined, QuestionCircleOutlined, MenuOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart, updateCartItem, removeCartItem, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

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

  // CartDrawer component
  const CartDrawer = () => (
    <Drawer
      title="Shopping Cart"
      placement="right"
      onClose={() => setCartOpen(false)}
      open={cartOpen}
      width={400}
      footer={cart && cart.items.length > 0 ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={async () => { await clearCart(); message.success('Cart cleared!'); }}>Clear Cart</Button>
          <Button type="primary" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>Checkout</Button>
        </div>
      ) : null}
    >
      {cart && cart.items.length > 0 ? (
        <div>
          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.event.title}</div>
                <div>Price: HK$ {item.event.price ?? 0}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                  <span>Qty:</span>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={async (val: number | null) => {
                      if (typeof val === 'number') {
                        await updateCartItem(item.id, val);
                        message.success('Quantity updated!');
                      }
                    }}
                    style={{ marginLeft: 8, width: 60 }}
                  />
                  <Popconfirm title="Remove item?" onConfirm={async () => { await removeCartItem(item.id); message.success('Item removed!'); }}>
                    <Button size="small" danger style={{ marginLeft: 12 }}>Remove</Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 24 }}>
            Total: HK$ {cart.items.reduce((sum, item) => sum + (item.event.price ?? 0) * item.quantity, 0)}
          </div>
        </div>
      ) : (
        <div>Your cart is empty.</div>
      )}
    </Drawer>
  );

  return (
    <Header
      style={{
        width: '100%',
        padding: 0,
        background: '#fff',
        boxShadow: '0 2px 8px #f0f1f2',
        zIndex: 10,
        position: 'sticky',
        top: 0,
        height: 60,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          padding: screens.md ? '0 40px' : '0 16px',
          height: 60,
          minHeight: 60,
          justifyContent: 'space-between',
        }}
      >
        {/* Logo left */}
        <div style={{ display: 'flex', alignItems: 'center', height: 60 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#ff5b00', textDecoration: 'none' }}>
            <img src="/media/EventCat_logo.png" alt="EventCat Logo" style={{ height: 48, marginRight: 16 }} />
          </Link>
        </div>
        {/* Desktop: nav links center, user actions right. Mobile: hamburger menu */}
        {screens.md ? (
          <>
            {/* Nav links center (spaced out) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
              {React.cloneElement(menu, {
                style: { ...menu.props.style, color: 'var(--color-text)', background: 'transparent', fontSize: 18, fontWeight: 500 },
                items: menuItems.map(item => ({
                  ...item,
                  label: (
                    <span style={{ color: location.pathname.startsWith(`/${item.key}`) || (item.key === 'home' && location.pathname === '/') ? 'var(--color-accent)' : 'var(--color-text)' }}>
                      {item.label}
                    </span>
                  )
                }))
              })}
            </div>
            {/* User actions right */}
            <div style={{ display: 'flex', alignItems: 'center', height: 60 }}>
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
                  <Button
                    icon={<ShoppingCartOutlined />}
                    style={{ marginLeft: 16, borderRadius: '50%', background: 'var(--color-neutral-light)', color: 'var(--color-neutral-dark)', border: '1px solid var(--color-neutral-dark)', position: 'relative' }}
                    onClick={() => setCartOpen(true)}
                  >
                    {cart && cart.items.length > 0 && (
                      <span style={{ position: 'absolute', top: 2, right: 2, background: '#ff5b00', color: '#fff', borderRadius: '50%', fontSize: 12, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.items.length}</span>
                    )}
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
            </div>
          </>
        ) : (
          <>
            <Button icon={<MenuOutlined />} type="text" onClick={() => setDrawerOpen(true)} style={{ marginLeft: 'auto', fontSize: 22 }} />
            <Drawer
              title={
                <span style={{ fontWeight: 700, fontSize: 22, color: '#ff5b00', display: 'flex', alignItems: 'center' }}>
                  <img src="/media/EventCat_logo.png" alt="EventCat Logo" style={{ height: 36, marginRight: 10 }} /> EventCat
                </span>
              }
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              bodyStyle={{ padding: 0 }}
            >
              {/* Nav links stacked */}
              <div style={{ padding: 16 }}>
                {menu}
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {token ? (
                    <>
                      <Button
                        style={{ borderRadius: '50%', padding: 0, width: 40, height: 40, background: 'var(--color-neutral-light)', border: '1px solid var(--color-neutral-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}
                        onClick={() => { setDrawerOpen(false); navigate('/profile'); }}
                      >
                        <Avatar
                          size={32}
                          src={getProfilePicUrl(profilePic)}
                          icon={!profilePic ? <UserOutlined /> : undefined}
                          style={{ background: 'var(--color-primary)', color: 'var(--color-neutral-dark)' }}
                        />
                      </Button>
                      <Button
                        icon={<ShoppingCartOutlined />}
                        style={{ marginLeft: 16, borderRadius: '50%', background: 'var(--color-neutral-light)', color: 'var(--color-neutral-dark)', border: '1px solid var(--color-neutral-dark)', position: 'relative' }}
                        onClick={() => setCartOpen(true)}
                      >
                        {cart && cart.items.length > 0 && (
                          <span style={{ position: 'absolute', top: 2, right: 2, background: '#ff5b00', color: '#fff', borderRadius: '50%', fontSize: 12, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.items.length}</span>
                        )}
                      </Button>
                      <Button icon={<LogoutOutlined />} onClick={() => { setDrawerOpen(false); handleLogout(); }} type="primary" danger block>
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
              </div>
            </Drawer>
          </>
        )}
      </div>
      <CartDrawer />
    </Header>
  );
};

export default Navbar; 