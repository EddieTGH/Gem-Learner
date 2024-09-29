import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import FlashcardsPage from './pages/flashcards-page/flashcards-page';

// import AnalyticsPage from "./pages/analytics-page/analytics-page";
// import NavigationBar from "./components/NavigationBar/NavigationBar";
import Auth from "./pages/supabase-login/supabase-login";
import LogOut from "./pages/supabase-logout/supabase-logout";
import { supabase } from "./components/supabaseClient";
import "./App.css";
import ChatBot from "./pages/chat-page/chat-page";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AnalyticsPage from './pages/analytics-page/analytics-page'; // Import AnalyticsPage
import RagPage from './pages/RAG-page/rag-page';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import FlashcardCategories from './pages/flashcards-page/flashcard-categories';

async function initializeChat() {
	const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	const chat = model.startChat({
		history: [
			{ role: 'user', parts: [{ text: 'Hello' }] },
			{
				role: 'model',
				parts: [{ text: 'Great to meet you. What would you like to know?' }],
			},
		],
	});
	return chat;
}

function App() {
	const [user, setUser] = useState(null);
	const [chat, setChat] = useState(null);
	const [convo_id, setId] = useState(null);

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};

		checkSession();
	}, []);

	useEffect(() => {
		async function init() {
			const chatObj = await initializeChat();
			setChat(chatObj);
			setId(uuidv4())
		}
		init();
	}, []);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						user ? <Navigate to="/chat-page" /> : <Auth setUser={setUser} />
					}
				/>
				<Route
					path="/logout"
					element={
						user ? (
							<LogOut user={user} setUser={setUser} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/chat-page"
					element={
						user ? <ChatBot user={user} chat={chat} convo_id={convo_id} /> : <Navigate to="/" />
					}
				/>
				<Route
					path="/flashcards-page"
					element={user ? <FlashcardsPage user={user} /> : <Navigate to="/" />}
				/>
				<Route
					path="/analytics-page"
					element={user ? <AnalyticsPage user={user} /> : <Navigate to="/" />}
				/>
				<Route
					path="/flashcard-categories"
					element={
						user ? <FlashcardCategories user={user} /> : <Navigate to="/" />
					}
				/>
        <Route path="/rag-page" element={<RagPage user={user} />} />
			</Routes>
		</Router>
	);

}

export default App;
