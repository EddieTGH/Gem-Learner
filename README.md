## Team

Edmond Niu - edmond.niu@gmail.com
Krishna Katakota - krk131@pitt.edu
Rahul Anantuni - anantuni.rahul@gmail.com
Eric Wang - eric_wang@college.harvard.edu

## Demo
https://github.com/user-attachments/assets/b2da022a-4e38-4656-ba19-069812953a12

**Video Demo**

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

**lashcard Sets**

<img width="1470" alt="Analyze Trends" src="https://github.com/user-attachments/assets/91c0aa11-c981-4904-9758-41cd9ca328d1">

**Analyze Trends**


## What it does

Gem Learn can be used just like Gemini (with chat history and contextual memory), but with the added functionality of being able to save query and response pairs in a simple flash card format! We noticed that the responses from Gemini are usually pretty long, so we have a custom prompt engineering pipeline that tailors the response length to be perfect for flashcards. The user can also edit the flashcard before saving it to the database, allowing for flexibility in card creation. Once the flashcards are in the database, they can be managed by placing them in user-created sets, modifying, or deleting them. We also included an analytics panel to look at categorical trends in queries to see what you tend to search for most, and a Pitt-specific career help chatbot built with retrieval augmented generation (RAG) and semantic retrieval for this busy recruiting season!

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

### Check out our video demo!

[Youtube](https://youtu.be/DuvRhxeNME4)
