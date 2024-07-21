import google.generativeai as genai # type: ignore
import json

genai.configure(api_key="AIzaSyCAmqZaei8uO24qS0MgIPEOhrKC_mQjaiw")

def programmer(prompt="", chat_history=[]):

    run = True

    while run:
        try:
            model = genai.GenerativeModel(
                model_name='gemini-1.5-pro',
                generation_config={"response_mime_type": "application/json"},
                system_instruction="""If the prompt you are given is related to a coding problem, as an experienced 
                software engineer write the code for the software that achieve the user prompt.
                Return all this in json format using the filenames as the key.
                Do not give any extra information apart from the code you are asked to give.
                
                If multiple files are needed do not hesitate to do so. 
                Make sure the code works, it is sensible and feasible!!!. Unless asked not to, use libraries that will
                make the workflow easier. 
                
                If you are writing in python, ensure to keep syntax and indentation standards!
                After or statements in python, use a backslash to prevent syntax errors. This is very important!!!
                When using multi-line comments in python, use triple double quotes or triple single quotes!!!"""
                )

            chat_history = chat_history[::-1]
            chat = model.start_chat(history=chat_history)
            response_2 = chat.send_message(prompt)
            print("Response original", response_2.text)
            return json.loads(response_2.text)
        except Exception as e:
            print(f"Found the boring error: {e}")


def debugger(prompt="", chat_history=[]):
    run = True

    while run:
        try:
            model = genai.GenerativeModel(
                model_name='gemini-1.5-pro',
                generation_config={"response_mime_type": "application/json"},
                system_instruction=""" 

                                You are an excellent expert developer. You can be given a piece of code, with the corresponding errors
                                that arose when trying to execute the said code. Your task is to fix this error. If the error is related
                                to technical/algorithm failure you are required to fix it. But if its a dependency sort of error then return
                                the command needs to be made to fix the dependency error. 
                                
                                If you made changes to a file, return the filename as the key and the adjusted code as the value.
                                 f its a dependency error, make the key dependency_0, dependency_1 and so on. 
                                 Make sure your solution fixes the code by adhering to detail attentively.

                                """
                )

            chat_history = chat_history[::-1]
            chat = model.start_chat(history=chat_history)
            response_2 = chat.send_message(prompt)
            print("Response original", response_2.text)
            return json.loads(response_2.text)
        except Exception as e:
            print(f"Found the boring error: {e}")


def dependency_bot(prompt=""):
    run = True

    while run:
        try:
            code = genai.GenerativeModel(
                model_name='gemini-1.5-pro',
                generation_config={"response_mime_type": "application/json"},
                system_instruction="""Given code input, return in json format the commands neccessary to ensure that the code you're given
                can run effectively. Do not give any advice, instruction of tips. Return only json format the command that will be needed to 
                install the dependecies from the shell. If you're dealing with a  react project make sure to add install react, next js, or anyother other external library you will use.
                Make sure the commands you are installing can be run in one go.

                This will be your output format: 
                    {'commands': ['pip install pygame', "npm i react", "pip install django"...]
            }
             """
                )

            response_2 = code.generate_content(prompt)
            print("Response original", response_2.text)
            return json.loads(response_2.text)
        except Exception as e:
            print(f"Found the boring error: {e}")


def executioner_bot(directory="", prompt=""):

    code = genai.GenerativeModel(
        model_name='gemini-1.5-pro',
        generation_config={"response_mime_type": "application/json"},
        system_instruction="""Given code input, return in json format the commands needed to run that file on the command line.
        The key will be commands and the shell commands will be a list of the commands you give.
        This is thre format of the json you must return below:
            {'commands': ['python hello_world.py', "npm run dev", "npm start", ...]
            }

        You are to return the command that will execute the given code on a shell terminal.
        Return a command that will run on the terminal without error. This is of the utmost importance. Do not return a command that
        will cause an error when type into a terminal. DO NOT!!! I REPEAT, DO NOT!!!
        
        
        """
        )


    response_2 = code.generate_content(prompt)
    print("Response original", response_2.text)
    return json.loads(response_2.text)


def simple_bot(message=""):
    # For now, the bot just responds with "Hi" to any message.
    code = genai.GenerativeModel(
        model_name='gemini-1.5-pro',
        system_instruction="""Give a brief high level technical overview of the code you may be given. Do not go over all the entire functions but
         rather try to ensure that you explain the working structure and alogrithms. Do not give tips. You're a professional,
         explain the code and algorithm that is in the code clearly. Do not try to explain each part of the code rather, give a high levl technical overview."""
        )


    response_2 = code.generate_content(message)
    print(response_2.text)
    return response_2.text
