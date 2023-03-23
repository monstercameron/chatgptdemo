import json
import os
import time
import openai
from dotenv import load_dotenv
import requests
import urllib3


urllib3.disable_warnings()
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


class ChatGPT:
    def __init__(self, model, ai_role, user_role):
        self.model = model
        self.ai_role = ai_role
        self.user_role = user_role
        self.history = []
        self.alive = True
        self.reset_history()

    class Message:
        def __init__(self, role, content):
            self.role = role
            self.content = content

        def to_dict(self):
            return {"role": self.role, "content": self.content}

    def reset_history(self):
        self.history = [
            {"role": "system", "content": "You are a helpful assistant."}]

    def setContext(self, context):
        self.history = [
            {"role": "system", "content": "You are a helpful. You can use api calls to get information, use "},
            {"role": f"user", "content": 'these are the api endpoints \n {context}'},
            {"role": "assistant", "content": "Hi, how may I help?"}
        ]

    def setContext2(self, comtextMessage, context1, contextb):
        self.history = [
            {"role": "system", "content": "You are a helpful. you must only seek to fetch information from the sources the user gives you"},
            {"role": f"user", "content": '{comtextMessage} \n {context1}  \n {contextb}'},
            {"role": "assistant",
                "content": "Hi, let me find out and get back to you... ```api```"}
        ]

    def extract_api_call(self, api_string):
        if "https://" in api_string:
            api_string = api_string.split("https://")[1]
            endpoint = api_string.split("api/")[1].split("```")[0]
            return f"https://swapi.dev/api/{endpoint}"
        else:
            return None

        import requests

    def make_starwars_api_call(self, url):
        url = url.strip()
        url = url + '?format=json'
        response = requests.get(url, verify=False)
        if response.status_code == 200:
            return json.dumps(response.json())
        else:
            return None

    def exit(self):
        self.alive = False

    def check_commands(self, prompt):
        if prompt == "/reset":
            self.reset_history()
            return True
        elif prompt == "/exit":
            self.exit()
            return True
        elif prompt == "/history":
            print(self.history)
            return True
        elif prompt == "":
            # this case covers empty prompts
            return True
        else:
            return False

    def prompt_openai(self):
        try:
            # Send the request to the OpenAI API
            return openai.ChatCompletion.create(
                model=self.model,
                messages=self.history
            )
        except openai.error.RateLimitError as e:
            if e.status_code == 429:
                # Rate limit exceeded, wait and try again
                print("Rate limit exceeded, waiting for 60 seconds...")
                time.sleep(60)
                return openai.ChatCompletion.create(
                    model=self.model,
                    messages=self.history
                )
            else:
                # Other error, re-raise the exception
                raise e

    def prompt_openai_get_summary(self, context):
        print('context-->', type(context), context)
        try:
            # Send the request to the OpenAI API
            return openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system",
                        "content": "Yyou answer in precise and concise language"},
                    {"role": f"user", "content": 'summarize \n {context}'},

                ]
            )
        except openai.error.RateLimitError as e:
            if e.status_code == 429:
                # Rate limit exceeded, wait and try again
                print("Rate limit exceeded, waiting for 60 seconds...")
                time.sleep(60)
                return openai.ChatCompletion.create(
                    model=self.model,
                    messages=[
                        {"role": "system",
                         "content": "Yyou answer in precise and concise language"},
                        {"role": f"user", "content": 'summarize \n {context}'},

                    ]
                )
            else:
                # Other error, re-raise the exception
                raise e

    def get_prompt_text(self, response):
        return response["choices"].pop(0)["message"]["content"]

    def add_to_chat_history(self, previous):
        self.history.append(previous)

    def run(self):
        # Reset the chat history and print a welcome message
        # self.reset_history()
        print("Welcome to ChatGPT in the terminal!\n")

        while self.alive:
            prompt = input(f"\n{self.user_role}: ")
            is_command = self.check_commands(prompt)
            if is_command:
                # If the user's input is a command, skip the rest of the loop and start a new iteration
                continue
            prompt = prompt + " using the starwars api endpoints given, return an api call"
            prompt_message = self.Message(self.user_role, prompt)
            self.add_to_chat_history(prompt_message.to_dict())
            response_raw = self.prompt_openai()
            response = self.get_prompt_text(response_raw)
            response_message = self.Message(self.ai_role, response)
            self.add_to_chat_history(response_message.to_dict())
            print(f'\n{self.ai_role}: {response}')
            print(f'\nAPI-call: {self.extract_api_call(response)}')

            newDetails = self.make_starwars_api_call(
                self.extract_api_call(response))
            print('api call:', newDetails)
            if newDetails is not None:
                getSummary = self.prompt_openai_get_summary(newDetails)
                # print('getSummary', getSummary)
                getSummary = self.get_prompt_text(getSummary)
                print('getSummary', getSummary)
                self.add_to_chat_history(getSummary)

        print("\nGood Bye.")

    def next(self, prompt):
        is_command = self.check_commands(prompt)
        if is_command:
            return "\n"
        prompt_message = self.Message(self.user_role, prompt)
        self.add_to_chat_history(prompt_message.to_dict())
        response_raw = self.prompt_openai()
        response = self.get_prompt_text(response_raw)
        response_message = self.Message(self.ai_role, response)
        self.add_to_chat_history(response_message.to_dict())
        return response
