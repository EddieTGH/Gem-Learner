import React from 'react';
import { supabase } from '../../components/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './supabase-logout.css';

function LogOut({ user, setUser }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="logout-page">
      <div className="logout-box">
        {user ? (
          <div>
            <h2>Goodbye, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <p>Please log in.</p>
        )}
      </div>
    </div>
  );
}

export default LogOut;
