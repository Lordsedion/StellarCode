import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyCAmqZaei8uO24qS0MgIPEOhrKC_mQjaiw")

def default_bot(prompt=""):

    code = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        system_instruction="""If the prompt you are given is related to a coding problem, as an experienced 
        software engineer write the code for the software that achieve the user prompt. Return all this in json format using the filenames as the key. Do not give any extra information apart from the code you are asked to give.
        If multiple files are needed do not hesitate to do so. Make sure the code works, it is sensible and feasible!!!. Unless asked not to, use libraries that will
        make the workflow easier. If you are writing in python, ensure to keep syntax and indentation standards!
        After or statements in python, use a backslash to prevent syntax errors. This is very important!!!"""
        )


    response_2 = code.generate_content(prompt)
    print("Response original", response_2.text[8:-3])
    print("Response Json", json.loads(response_2.text[8:-3]))
    names = list(json.loads(response_2.text[8:-3]).keys())

    return json.loads(response_2.text[8:-3])
