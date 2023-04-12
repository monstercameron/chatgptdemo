// Set the initial visibility of the chat thread to false
let chatThreadVisibility = false;

// Get the header bar element
const article = document.querySelector("#header-bar-slots");
console.log("Article -->", article);

// Create the chat thread and badge elements
const chatThreadElement = document.createElement("div");
const badge = document.createElement("div");

// send button
const textInputButton = document.createElement('div');
const textInputElement = document.createElement('input');

// reset button
const resetLink = document.createElement("a");

// chat history
let chatHistory = []

// Define an array to store chat prompts
const chatPrePrompts = [{ "role": "system", "content": "you are a helpful assistant" }];

// Define chat messages
const chatMessages = [
  {
    role: "assistant",
    content: "Hello, how can I assist you today?",
  },
  {
    role: "user",
    content: "I need help with my account.",
  },
  {
    role: "assistant",
    content: "Sure, what's the issue?",
  },
  {
    role: "user",
    content: "I can't log in.",
  },
  {
    role: "assistant",
    content: "Have you tried resetting your password?",
  },
  {
    role: "user",
    content: "No, I haven't. How do I do that?",
  },
  {
    role: "assistant",
    content: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
  },
];

// Insert the chat button into the DOM
const insertChatButton = () => {
  console.log("Insert chat button into DOM");

  const img = document.createElement("img");

  // Set the src and alt attributes of the chat button
  img.src = chrome.runtime.getURL(`chat.png`);
  img.alt = "Chat icon";

  // Scale down the chat button image by 25%
  img.style.width = "50%";

  // Center the chat button image horizontally and vertically
  img.style.display = "block";
  img.style.margin = "auto";

  img.classList.add('icon')

  // Append the img element to the badge element
  badge.appendChild(img);

  // Insert the badge element to the beginning of the article element
  article.insertBefore(badge, article.firstChild);
  article.firstChild.classList.add('container', 'pointer')
};

// Insert the chat thread container into the DOM
const insertChatThreadContainer = () => {
  console.log("Insert chat thread button into DOM");

  // Create the text display element
  const textDisplay = document.createElement("div");
  textDisplay.classList.add("chatThreadContainer")
  // textDisplay.textContent = "Chat thread"; // Set the text content for the text display element

  // Create a text input element
  textInputElement.type = 'text';
  textInputElement.classList.add('textInput')
  textInputElement.placeholder = 'type a prompt to krew'; // Optional: Add a placeholder text

  // send button
  textInputButton.classList.add("textInputButton")
  const img = document.createElement("img");
  // Set the src and alt attributes of the chat button
  img.src = chrome.runtime.getURL(`send.png`);
  img.alt = "Chat icon";
  textInputButton.appendChild(img);

  // input container
  const textInputContainer = document.createElement('div');
  textInputContainer.classList.add("textInputContainer")
  textInputContainer.appendChild(textInputElement)
  textInputContainer.appendChild(textInputButton)

  // Append the text display and text input elements to the chat thread container
  chatThreadElement.appendChild(textDisplay);
  chatThreadElement.appendChild(textInputContainer);

  // Add the 'chat' class to the chat thread container (optional, if needed)
  chatThreadElement.classList.add('chat');

  // Append the chat thread container to the body of the document
  document.body.appendChild(chatThreadElement);
};

// Insert chat messages into the chat thread
const insertIntoChatThread = (chatMessages) => {
  if (chatMessages.length > 0) {
    chatThreadElement.firstChild.innerHTML = ''
    chatMessages.forEach(({ role, content }) => {
      const div = document.createElement("div");
      div.classList.add(role)
      div.textContent = content
      chatThreadElement.firstChild.appendChild(div)
    })

    const div = document.createElement("div");
    div.classList.add("reset")
    resetLink.textContent = "Reset Chat"
    div.appendChild(resetLink)
    chatThreadElement.firstChild.appendChild(div)
  } else {
    chatThreadElement.firstChild.innerHTML = 'Ask me anything about your Organization'
  }
}

// Send a chat message to OpenAI
const sendChat = (chatHistory) => {
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer sk-",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: chatPrePrompts.concat(chatHistory),
      temperature: 0.7
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const chatResponse = data.choices[0].message;
      chatHistory.push(chatResponse);
      // // Create a new chat response element and add it to the chat thread
      // const chatResponseElement = document.createElement("div");
      // chatResponseElement.textContent = chatResponse;
      // chatThreadElement.appendChild(chatResponseElement);

      // // Scroll to the bottom of the chat thread
      // chatThreadElement.scrollTop = chatThreadElement.scrollHeight;
      insertIntoChatThread(chatHistory);
    })
    .catch(error => console.error(error));
};

// Add an onclick event listener to the chat badge
badge.addEventListener("click", (event) => {
  event.preventDefault()

  // Position the chat thread element below the badge button
  const badgeRect = badge.getBoundingClientRect();
  chatThreadElement.style.top = (badgeRect.bottom + 15) + "px";
  chatThreadElement.style.left = (badgeRect.left - 170) + "px";

  // Toggle the visibility of the chat thread element
  if (chatThreadVisibility) {
    chatThreadElement.style.display = "none";
    chatThreadElement.classList.remove('fade-in')
    chatThreadVisibility = false;
  } else {
    chatThreadElement.style.display = "block";
    chatThreadElement.classList.add('fade-in')
    chatThreadVisibility = true;
  }
});

// Function to handle the logic for sending the chat message
function handleSendMessage() {
  console.log("send", textInputElement.value);
  if (textInputElement.value) {
    chatHistory.push({ role: "user", content: textInputElement.value.trim() });
    // send chat to openai
    sendChat(chatHistory);
  } else {
    textInputElement.placeholder = "Type a prompt to kew";
  }
  // reset input field
  textInputElement.value = "";
}

// Event listener for the "click" event on the textInputButton
textInputButton.addEventListener("click", (event) => {
  event.preventDefault();
  handleSendMessage();
});

// Event listener for the "keydown" event on the textInputElement
textInputElement.addEventListener("keydown", (event) => {
  // Check if the key that was pressed is the Enter key
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    handleSendMessage();
  }
});

// Event listener for the "click" event on the textInputButton
resetLink.addEventListener("click", (event) => {
  event.preventDefault();
  chatHistory = []
  insertIntoChatThread(chatHistory);
});

// Insert the chat button and chat thread container into the DOM
insertChatButton();
insertChatThreadContainer();

// Insert the chat messages into the chat thread
// console.log(chatThreadElement.firstChild);
insertIntoChatThread([...chatMessages, ...chatMessages]);