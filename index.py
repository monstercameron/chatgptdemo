from chatgpt import ChatGPT
from context import compressContext, compressContext2

model = "gpt-3.5-turbo"
aiRole = "assistant"
userRole = "user"
chatGPT = ChatGPT(model, aiRole, userRole)
chatGPT.setContext(compressContext2('calen org chart csv.csv'))

chatGPT.run()
