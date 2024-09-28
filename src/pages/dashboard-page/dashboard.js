import { supabase } from '../../components/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
  
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      setUser(null); // Update the user state in App component
      navigate('/'); // Navigate to login page
    };
  
    return (
      <div className="App">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <p>Please log in.</p>
        )}
      </div>
    );
  }
  
  export default Dashboard;