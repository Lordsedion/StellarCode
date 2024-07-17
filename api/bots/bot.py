import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyCAmqZaei8uO24qS0MgIPEOhrKC_mQjaiw")

def programmer(prompt="", chat_history=[]):

    model = genai.GenerativeModel(
        model_name='gemini-1.5-pro',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""If the prompt you are given is related to a coding problem, as an experienced 
        software engineer write the code for the software that achieve the user prompt. Return all this in json format using the filenames as the key. Do not give any extra information apart from the code you are asked to give.
        If multiple files are needed do not hesitate to do so. Make sure the code works, it is sensible and feasible!!!. Unless asked not to, use libraries that will
        make the workflow easier. If you are writing in python, ensure to keep syntax and indentation standards!
        After or statements in python, use a backslash to prevent syntax errors. This is very important!!!
        When using comments in python, use triple single quotes. TRIPLE SINGLE QUOTES and never triple double quotes."""
        )

    chat_history = chat_history[::-1]
    chat = model.start_chat(history=chat_history)
    response_2 = chat.send_message(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def dependency_bot(prompt=""):

    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""Given code input, return in json format the commands neccessary to ensure that the code you're given
        can run effectively. Do not give any advice, instruction of tips. Return only json format the command that will be needed to 
        install the dependecies from the shell."""
        )


    response_2 = code.generate_content(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def executioner_bot(prompt=""):

    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""Given code input, return in json format the commands needed to run that file on the command line.
        You are to return the command that will execute the given code on a shell terminal."""
        )


    response_2 = code.generate_content(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def simple_bot(message=""):
    # For now, the bot just responds with "Hi" to any message.
    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        system_instruction="""Give a brief high level technical overview of the code you may be given. Do not go over all the entire functions but
         rather try to ensure that you explain the working structure and alogrithms. Do not give tips. You're a professional,
         explain the code and algorithm that is in the code clearly. Do not try to explain each part of the code rather, give a high levl technical overview."""
        )


    response_2 = code.generate_content(message)
    print(response_2.text)
    return response_2.text
