## What is Gem Learn?

Gem Learn is a tool that enhances the Google Gemini experience. Gone are the days of querying for important information and forgetting the answers hours later. With Gem Learn, flashcards can be automatically created based on the most recent query and stored in sets to be learned and most importantly - reviewed and remembered later. We also built a Pitt-specific career help chatbot trained and fine-tuned on Pitt CSC’s public resources on improving your resume, preparing for interviews, and landing your first job!

## What it does

Gem Learn can be used just like Gemini (with chat history and contextual memory), but with the added functionality of being able to save query and response pairs in a simple flash card format! We noticed that the responses from Gemini are usually pretty long, so we have a custom prompt engineering pipeline that tailors the response length to be perfect for flashcards. The user can also edit the flashcard before saving it to the database, allowing for flexibility in card creation. Once the flashcards are in the database, they can be managed by placing them in user-created sets, modifying, or deleting them. We also included an analytics panel to look at categorical trends in queries to see what you tend to search for most, and a Pitt-specific career help chatbot built with retrieval augmented generation (RAG) and semantic retrieval for this busy recruiting season!

## How we built it

We built Gem Learn using React for our frontend, Supabase for the database, a Flask server for RAG, and the Google Gemini API. The chat tab is used to converse with Gemini just like in the actual app, the flashcards tab can be used to study your personalized flashcards, and the analytics tab can be accessed to view your chat trends. The career chatbot was built in the Python flask server backend utilizing retrieval augmentation generation (RAG), extracting data from various Pitt websites, creating vector embeddings, performing semantic retrieval, and wrapping responses with Gemini to return an overall more contextually relevant response to Pitt students' career prep queries.

## Awards

[SteelHacks XI 2025](https://steelhacks-xi.devpost.com/) Hackathon Winner: [Best Pitt Inspired Demo powered by Gemini API](https://devpost.com/software/geminilearner)

## Team

Edmond Niu - edmond.niu@gmail.com
Krishna Katakota - krk131@pitt.edu
Rahul Anantuni - anantuni.rahul@gmail.com
Eric Wang - eric_wang@college.harvard.edu

## Video Demo
https://github.com/user-attachments/assets/146cb94a-867c-4abe-ace8-3a7930f622bb

## Pictures

<img width="1073" alt="Gemini Chat Page" src="https://github.com/user-attachments/assets/032d1131-4b07-4239-a30b-676cd3e5c4ea">

**Gemini Chat Page**

<img width="1466" alt="Add Flashcard" src="https://github.com/user-attachments/assets/7e53a709-4cc9-43c6-bd42-70310cd7eba0">

**Add Flashcard**

<img width="1470" alt="Edit Flashcard" src="https://github.com/user-attachments/assets/744305c2-7e59-47c8-bd5c-a4f18bd4c9a3">

**Edit Flashcard**

<img width="1470" alt="Studying a Set" src="https://github.com/user-attachments/assets/0cc57624-15c3-43d5-b3ce-41ecbc2f501c">

**Studying a Flashcard Set**

<img width="1454" alt="Career Prep ChatBot" src="https://github.com/user-attachments/assets/fece2317-8503-4216-940c-93f500c05430">

**Retrieval Augmented Generation (RAG) Career Chatbot**

<img width="1470" alt="Study Sets" src="https://github.com/user-attachments/assets/d17ff6c0-1896-4e51-952f-72d31af2f282">

**Flashcard Sets**

<img width="1470" alt="Analyze Trends" src="https://github.com/user-attachments/assets/91c0aa11-c981-4904-9758-41cd9ca328d1">

**Analyze Trends**

## How to use it

Unfortunately, because of Supabase authorization restrictions, in order to use Gem Learn, Supabase has to be set up in the same format as ours. The database schema is shown below.

![alt text](image.png)

Once a supabase is set up as follows, a .env file has to be setup with a REACT_APP_GEMINI_API_KEY variable with a Gemini API key and a REACT_APP_SUPABASE_API_KEY variable with a supabase api key. A service_account_key.json must be setup in the flask-backend folder [Link](https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount). After this, the flask-baskend should be run by using

```
pip install -U google-ai-generativelanguage google-auth-oauthlib google-labs-html-chunker
python app.py
```

Some other pip installs might be necessary. Once the flask-backend is running, open another terminal and run

```
npm install
npm start
```

to run Gem Learn! There's functionality to query Gemini, create flashcards, look at analytics, and use the Pitt career help chatbot!

### Devpost

[Devpost](https://devpost.com/software/geminilearner)

### Demo

[Youtube](https://youtu.be/DuvRhxeNME4)
