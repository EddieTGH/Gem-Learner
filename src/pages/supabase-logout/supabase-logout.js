import { supabase } from '../../components/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './supabase-logout.css'; // Import the CSS file

function LogOut({ user, setUser }) {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null); // Update the user state in App component
		navigate('/'); // Navigate to login page
	};

	return (
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
	);
}

export default LogOut;
