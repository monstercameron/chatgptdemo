from chatgpt import ChatGPT
from context import context

model = "gpt-3.5-turbo"
aiRole = "assistant"
userRole = "user"
chatGPT = ChatGPT(model, aiRole, userRole)
chatGPT.setContext(context=context)

chatGPT.run()
