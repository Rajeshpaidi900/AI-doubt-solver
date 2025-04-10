# DoubtSolver

A web application that uses ChatGPT to provide answers to user questions.

## Features

- Ask any question and get detailed answers powered by OpenAI's GPT models
- Markdown formatting for well-structured answers including code blocks
- Question history tracking with ability to revisit previous questions
- Copy answer text to clipboard
- Regenerate answers if needed
- Responsive design for both desktop and mobile devices

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **API Integration**: OpenAI API
- **Data Storage**: In-memory storage with localStorage for question history

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the application with `npm run dev`
5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Type your question in the input field at the bottom of the page
2. Press Enter or click the Send button to submit your question
3. Wait for the answer to be generated
4. View your question history in the sidebar (desktop) or by clicking the history button (mobile)
5. Click on any previous question to view it again

## License

MIT