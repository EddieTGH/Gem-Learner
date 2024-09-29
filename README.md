## Inspiration

Gem Learn is a tool that enhances the Google Gemini experience. Gone are the days of querying for information and forgetting the answers hours later. With Gem Learn, flashcards can be automatically created based on the most recent query and stored in sets to be learned and most importantly - reviewed and remembered later. We also have a special Career Help by Pitt section to help you land a job using Pitt CSC’s materials on preparing for interviews!

## What it does

Gem Learn can be used just like Gemini, but with the added functionality of being able to save query and response pairs in a simple flash card format! We noticed that the responses from Gemini are usually pretty long, so we have a custom prompt engineering pipeline that tailors the response length to be perfect for flashcards. The user can also edit the flashcard before saving it to the database, allowing for flexibility in card creation. Once the flashcards are in the database, they can be managed by placing them in user-created sets, modifying, or deleting them. We also included an analytics panel to look at categorical trends in queries to see what you tend to search for most, and a career help page for this busy recruiting season!

## How we built it

We built Gem Learn using React for our frontend, Supabase for the database, a Flask server, and the Google Gemini API. The chat tab is used to converse with Gemini just like in the actual app, the flashcards tab can be used to study your personalized flashcards, and the analytics tab can be accessed to view your chat trends.

## Challenges we ran into

Although we were all somewhat familiar with React, it was our first time working with such a large React codebase, especially considering that we were implementing a multiple-table database and integrating the Google Gemini API. It was challenging to get it all working in harmony, and things like working with CSS to get elements in the right place and wrangling all the data from chat queries to perform comprehensive analytics took up most of our time. Working together on Github and resolving merge conflicts was also a challenge, since taking a bit longer that expected on a feature could mean being multiple commits behind the main branch, leading to even more merge-related chaos.

## Accomplishments that we're proud of

We’re proud that we were able to achieve our goals for this hackathon. We started off by developing levels of MVPs based on bare minimums, happy mediums, and optimistic goals. We were able to finish all of the goals that we wanted to reach, and were even able to accomplish some of our stretch goals.

## What we learned

As a team, we learned how to tackle a large scale project, and how to create a full stack web application with large amounts of data.

## What's next for Gem Learn

The next steps for the app focus on enhancing the user experience and expanding functionality. First, we're adding hints to the flashcards so you can get clues without seeing the answer right away, which should help you remember things. We're also going to have different types of flashcards, like fill-in-the-blank and multiple-choice, so it fits the many different ways people like to learn. We’ll expand the number of main categories and add subcategories for flash card sets and analytics, so it's easier to focus on specific topics. We’ll also make sure the app can keep making new flashcards in the background while you’re using it, and we’ll add a way to track how well you’re learning over time, Anki-style. Plus, you’ll be able to print the flashcards if you want to study offline.
