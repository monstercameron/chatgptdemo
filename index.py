from api import StarWarsAPI
from chatgpt import ChatGPT
from context import compressContext, compressContext2

model = "gpt-3.5-turbo"
aiRole = "assistant"
userRole = "user"
chatGPT = ChatGPT(model, aiRole, userRole)
# chatGPT.setContext(compressContext2('samples/calen org chart csv.csv'))
starwars = StarWarsAPI()
chatGPT.setContext2('Here are api endpoints and the function to call tehm', starwars.summary,starwars.make_api_call_description)

chatGPT.run()
