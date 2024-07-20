# Stellarcode - AI Software Developer Agent

Stellarcode is an AI software that aims to create agents that can communicate with each other to write,
debug and iteratively improve code through the combination and communication of multiple agents working
towards the same goal. 

There will be no need for copying and pasting code because the agent will handle
all these tasks allowing you to focus on what matters. Regardless of skill level, anyone can 
develop software using this Agent

## Project Structure:
The repository is structured as follows:

- *__api/:__* This folder contains the backend code responsible for the functionality of this product. 
It handles the request, WebSockets, and agent tasks delegation, and actions.

- *__frontend/:__* This folder contains the frontend code used for managing the Ui state, it is written strictly in React JS,
  state management is done through useContext, an update to Redux will be rolled out soon.

- *__staticfiles/:__* This folder contains the default static code for the Django web server.

- *__stellarcode/:__* This folder contains the main functionality of the Django project. All Middleware settings,
   files and other important components can be found here.

- *__manage.py/:__* This file provided by the default Django setup is used to run, configure and manage the server.

## AIM

This project aims to bring AI agents to the general public and democratize the ability to create software applications 
from just a specialized skill where only a select few can create programs to something that is generally accessible.

## How It Works

Stellarcode operates on the well-known fact that LLM coding and reasoning ability on tests tend to go up if they can review their code and its output. We aim to use this fact along with some other external techniques to improve the coding ability of these agents, from just generating code for a single file to generating code for an entire project through iterative feedback and development.

This project is powered by Google Gemini 1.5 Pro.
    
