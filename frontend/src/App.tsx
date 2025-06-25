import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import EventPage from './components/events/EventPage';
import EventForm from './components/events/EventForm';
import ProtectedRoute from './components/routing/ProtectedRoute';
import CategoryManager from './components/events/CategoryManager';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <hr />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/create-event" element={<EventForm />} />
              <Route path="/events/:id/edit" element={<EventForm />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
