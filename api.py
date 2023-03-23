import requests


class StarWarsAPI:
    def __init__(self):
        self.baseUrl = "http://swapi.dev/api"
        self.people = "/people/"
        self.peopleSchema = "/people/schema/"
        self.films = "/films/"
        self.films = "/films/schema/"

    def make_api_call(self, endpoint, params=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            return None
        
    def make_api_call_description():
        return '''
            def make_api_call(self, endpoint, params=None):
                url = f"{self.base_url}{endpoint}"
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
                else:
            return None'''

    def __repr__(self):
        return f"StarWarsAPI(base_url='{self.base_url}', people='{self.people}', people_schema='{self.people_schema}', films='{self.films}', films_schema='{self.films_schema}')"

    def summary(self):
        return {
            'base_url': 'The base URL for the Star Wars API',
            'people': 'The path to the "people" endpoint',
            'people_schema': 'The path to the "people/schema" endpoint',
            'films': 'The path to the "films" endpoint',
            'films_schema': 'The path to the "films/schema" endpoint'
        }

