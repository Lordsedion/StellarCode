import google.generativeai as genai
import json

def simple_bot(message=""):
    # For now, the bot just responds with "Hi" to any message.
    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        system_instruction="""Give an high-level overview on how you will solve this problem but do not write code!!!
        Do not give any advice, do not go into the nitty gritty details. Give an high-level explanation of 
        how you will do the planning and all. And be brief abot it."""
        )


    response_2 = code.generate_content(message)
    print(response_2.text)
    # print(json.loads(response_2.text[8:-3]))

    return response_2.text




# Create message object >>>
# Allow Frontend connection to websocket  >>>
# Allow client connection to websocket  ???
# Create bot response sequence >>>
# Allow user registration  >>>
# Allow user login >>>
# Sync chat with frontend ???
# Allow persistence chat and organize message object content into persistence chat format ???
# Develop the bot to create basic reply ???
# Room Creation and message sending from the chat ???
# Allow users to switch between models ???
# User login with gmail  ???
# Create cookies to hold user details ???
# Allow refresh and access tokens to be used to access the site ???
# Protection against Cross-site-scripting attacks ???
# Develop the client.py script and connect it to the backend ???
# Splitting frontend bot response to be more readable than client.py response ???
# Allow bot persistence to solving challenges it encounters for up to 10 iterations ???
# Development of user agents to manage test cases, code creation and testing ???
# Allow bot to be able to search for solutions to errors online ???
# Deploy application to a web server ???
# Research & Development ???


