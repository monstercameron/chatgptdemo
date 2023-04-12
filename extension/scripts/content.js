// Set the initial visibility of the chat thread to false
let chatThreadVisibility = false;

// Get the header bar element
let article = document.querySelector("#header-bar-slots");
console.log("Article -->", article);

// Create the chat thread and badge elements
const chatThreadElement = document.createElement("div");
const badge = document.createElement("div");

// send button
const textInputButton = document.createElement('div');
const textInputElement = document.createElement('input');

// Create the text display element
const textDisplay = document.createElement("div");

// reset button
const resetLink = document.createElement("span");

// full context
let context = []

// chat history
let chatHistory = []

// Define an array to store chat prompts
const chatPrePrompts = [{ "role": "system", "content": "you are a confident and helpful assistant" }];

// Insert the chat button into the DOM
const insertChatButton = () => {
  // console.log("Insert chat button into DOM");
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
  if (!article) {
    console.log("Trying to get the insertion point again");
    article = document.querySelector("#header-bar-slots");
  }

  article.insertBefore(badge, article.firstChild);
  article.firstChild.classList.add('container', 'pointer')
};

// Insert krew into chat thread 
const insertKrew = () => {
  // insert krew
  const krewContainer = document.createElement("div");
  krewContainer.classList.add("krew")
  const krewImage = document.createElement("img");
  krewImage.src = chrome.runtime.getURL(`krew.png`);

  // initial krew message
  const krewMessage = document.createElement("div");
  krewMessage.classList.add("assistant")
  krewMessage.textContent = "Hi, I'm Krew, How can I help you with the Orgchart?"

  krewContainer.appendChild(krewImage)
  textDisplay.appendChild(krewContainer)
  textDisplay.appendChild(krewMessage)
}

// Insert the chat thread container into the DOM
const insertChatThreadContainer = () => {
  // console.log("Insert chat thread button into DOM");
  textDisplay.classList.add("chatThreadContainer")
  // textDisplay.textContent = "Chat thread"; // Set the text content for the text display element

  insertKrew()

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
    insertKrew()
    chatMessages.forEach(({ role, content }) => {
      const div = document.createElement("div");
      div.classList.add(role)

      if (role === "assistant") {
        div.innerHTML = content
      } else {
        div.innerHTML = content.split(',')[0]
      }

      chatThreadElement.firstChild.appendChild(div)
    })

    const div = document.createElement("div");
    div.classList.add("reset")
    resetLink.textContent = "Reset Chat"
    div.appendChild(resetLink)
    chatThreadElement.firstChild.appendChild(div)
  } else {
    chatThreadElement.firstChild.innerHTML = ''
    insertKrew()
  }
}

// Send a chat message to OpenAI
const sendChat = (chatHistory) => {
  const messages = chatPrePrompts.concat(chatHistory)
  // console.log(messages);
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer sk-",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const chatResponse = data.choices[0].message;
      chatHistory.push(chatResponse);
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
    chatHistory.push({ role: "user", content: textInputElement.value.trim() + ", respond in html" });
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

// Load JSON for context
const loadJson = (callback) => {
  const jsonUrl = chrome.runtime.getURL('json.txt');
  // console.log(jsonUrl);

  // Fetch the contents of the JSON file
  fetch(jsonUrl)
    .then((response) => {
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error('Failed to fetch JSON file');
      }
      // Parse the JSON data
      return response.json();
    })
    .then((newContext) => {
      // Log the parsed JSON data
      // console.log(context);
      context = newContext.data;
      callback()
    })
    .catch((error) => {
      // Log any errors that occurred during the fetch and parsing process
      console.error(error);
    });
};

const pickKeys = (obj, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result;
}

// get context for chat
const getContext = (whatContext) => {
  const fields = []
  switch (whatContext) {
    case 'gender':
      fields.push(...["EmployeeName", "Gender", "ManagerName", "CompanyName"])
      break;
    case 'positions':
      fields.push(...["EmployeeName", "ManagerName", "CompanyName", "JobDescription"])
      break;
    case 'details':
      fields.push(...["EmployeeName", "ManagerName", "CompanyName", "EecFullTimeOrPartTime", "Location", "OriginalHireDate", "WorkPhoneNumber", "JobDescription"])
      break;
    default:
      break
  }
  // console.log(fields, context);
  // const chatPrePrompts = [{ "role": "system", "content": "you are a helpful assistant" }];
  const newContext = context.map((itm) => {
    // console.log(itm, fields);
    const newItm = pickKeys(itm, fields)
    // console.log(newItm);
    let sentence = ''
    for (const key in newItm) {
      // console.log(key);
      sentence += `${key} : ${newItm[key]}, `
    }
    // console.log("sentence ->", sentence);
    return sentence
  }).join("")
  console.log("newContext ->", newContext);
  chatPrePrompts.push({ "role": "user", "content": `this is my orgchart ${newContext}` });
  chatPrePrompts.push({ "role": "assistant", "content": `<div>Hi, how may I help you?</div>` });
}

// Insert the chat button and chat thread container into the DOM
insertChatButton();
insertChatThreadContainer();
loadJson(() => {
  getContext("gender")
});


// Insert the chat messages into the chat thread
// console.log(chatThreadElement.firstChild);
// insertIntoChatThread([...chatMessages, ...chatMessages]);