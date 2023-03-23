import requests


url='https://swapi.dev/api/people/1/?format=json'

response = requests.get(url, verify=False)

print(response.json())