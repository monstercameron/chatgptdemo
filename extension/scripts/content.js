const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}

const insertChatButton = () => {
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.innerHTML = `<button>chat</button>`;
  const date = article.querySelector("time")?.parentNode;
  (date ?? heading).insertAdjacentElement("afterend", badge);
};

const chatHistory = [];

const chatPrePrompts = [];

const chatThread = () => {};

const sendChat = (chatHistory) => {
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer <token goes here>",
      "Content-Type": "application/json",
    },
    // body: '{\n "model": "gpt-3.5-turbo",\n "messages": [{"role": "user", "content": "What is the OpenAI mission?"}]\n}',
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "What is the OpenAI mission?",
        },
      ],
    }),
  });
};

async () => {
  insertChatButton();
};
