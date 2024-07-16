import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyCAmqZaei8uO24qS0MgIPEOhrKC_mQjaiw")

def programmer(prompt="", chat_history=[]):

    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""If the prompt you are given is related to a coding problem, as an experienced 
        software engineer write the code for the software that achieve the user prompt. Return all this in json format using the filenames as the key. Do not give any extra information apart from the code you are asked to give.
        If multiple files are needed do not hesitate to do so. Make sure the code works, it is sensible and feasible!!!. Unless asked not to, use libraries that will
        make the workflow easier. If you are writing in python, ensure to keep syntax and indentation standards!
        After or statements in python, use a backslash to prevent syntax errors. This is very important!!!"""
        )

    chat = model.start_chat(history=chat_history)
    response_2 = model.generate_content(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def dependency_bot(prompt=""):

    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""Given code input, return in json format the commands neccessary to ensure that the code you're given
        can run effectively. DO not give any advice, instruction of tips. Return only json format the command that will be needed to 
        install the dependecies from the shell."""
        )


    response_2 = code.generate_content(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def simple_bot(message=""):
    # For now, the bot just responds with "Hi" to any message.
    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        system_instruction="""Explain the following code your are given in detail. Do not go over all the entire functions but
         rather try to ensure that you explain the working structure and alogrithms. Do not give tips. You're a professional,
         explain the code and algorithm that is in the code clearly. Do not try to explain each part of the code rather, give a high levl technical overvoew."""
        )


    response_2 = code.generate_content(message)
    print(response_2.text)
    return response_2.text
