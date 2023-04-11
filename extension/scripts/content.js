// Set the initial visibility of the chat thread to false
let chatThreadVisibility = false;

// Get the header bar element
const article = document.querySelector("#header-bar-slots");
console.log("Article -->", article);

// Create the chat thread and badge elements
const chatThreadElement = document.createElement("div");
const badge = document.createElement("div");

// Define chat messages
const chatMessages = [
  {
    role: "ai",
    message: "Hello, how can I assist you today?",
  },
  {
    role: "user",
    message: "I need help with my account.",
  },
  {
    role: "ai",
    message: "Sure, what's the issue?",
  },
  {
    role: "user",
    message: "I can't log in.",
  },
  {
    role: "ai",
    message: "Have you tried resetting your password?",
  },
  {
    role: "user",
    message: "No, I haven't. How do I do that?",
  },
  {
    role: "ai",
    message: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
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
  textDisplay.textContent = "Chat thread"; // Set the text content for the text display element

  // Create a text input element
  const textInputElement = document.createElement('input');
  textInputElement.type = 'text';
  textInputElement.placeholder = 'Type your message here...'; // Optional: Add a placeholder text

  // send button
  const textInputButton = document.createElement('div');
  textInputButton.text = '-->';

  // Append the text display and text input elements to the chat thread container
  chatThreadElement.appendChild(textDisplay);
  chatThreadElement.appendChild(textInputElement);
  chatThreadElement.appendChild(textInputButton);

  // Add the 'chat' class to the chat thread container (optional, if needed)
  chatThreadElement.classList.add('chat');

  // Append the chat thread container to the body of the document
  document.body.appendChild(chatThreadElement);
};

// Insert chat messages into the chat thread
const insertIntoChatThread = (chatMessages) => {
  return chatMessages.map(({ role, message }) => {
    return `<div class="${role}">${message}</div>`
  })
}

// Define an array to store chat prompts
const chatPrePrompts = [];

// Send a chat message to OpenAI
const sendChat = (chatHistory) => {
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer <token goes here>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-davinci-002",
      prompt: chatPrePrompts.concat(chatHistory).join('\n'),
      temperature: 0.7,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"]
    }),
  })
    .then(response => response.json())
    .then(data => {
      const chatResponse = data.choices[0].text.trim();
      chatHistory.push(chatResponse);
      // Create a new chat response element and add it to the chat thread
      const chatResponseElement = document.createElement("div");
      chatResponseElement.textContent = chatResponse;
      chatThreadElement.appendChild(chatResponseElement);

      // Scroll to the bottom of the chat thread
      chatThreadElement.scrollTop = chatThreadElement.scrollHeight;
    })
    .catch(error => console.error(error));
};

// Add an onclick event listener to the chat badge
badge.addEventListener("click", (event) => {
  event.preventDefault()

  // Position the chat thread element below the badge button
  const badgeRect = badge.getBoundingClientRect();
  chatThreadElement.style.top = (badgeRect.bottom + 15) + "px";
  chatThreadElement.style.left = (badgeRect.left - 130) + "px";

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

// Insert the chat button and chat thread container into the DOM
insertChatButton();
insertChatThreadContainer();

// Insert the chat messages into the chat thread
console.log(chatThreadElement.firstChild);
chatThreadElement.firstChild.innerHTML = insertIntoChatThread(chatMessages);