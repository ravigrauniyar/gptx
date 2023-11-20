CGPTX - An OpenAI API-based ChatGPT clone application.
Includes a React app for UI and a Dotnet Core API for Backend support.

Steps to run the application:
1. Clone the repository and navigate to the GPTX/gpt-clone folder.
2. Visit "https://platform.openai.com/api-keys" and create a new API key if you don't already have one.
3. Create a .env file and add the following:
    VITE_OPENAI_API_KEY = "YOUR_API_KEY"
    VITE_OPENAI_URL = https://api.openai.com/v1/chat/completions
    VITE_BASE_URL = http://localhost:5299/api

4. Ensure that no Postgres image is present in your docker engine.
5. Make sure that ports 3000 and 5299 are available.
6. Navigate to GPTX folder and run the "deployment.sh" file.
7. Visit "http://localhost:3000" to access UI for ChatGPTX application.
8. Go to "http://localhost:5299/swagger/index.html" to use Backend API.