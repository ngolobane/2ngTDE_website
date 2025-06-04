// Customer Service Chatbot for StyleHub
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot elements
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    
    const chatbotButton = document.createElement('div');
    chatbotButton.className = 'chatbot-button';
    chatbotButton.innerHTML = '<i class="fas fa-comments"></i>';
    
    const chatbotWindow = document.createElement('div');
    chatbotWindow.className = 'chatbot-window';
    chatbotWindow.style.display = 'none';
    
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <div class="chatbot-title">
            <i class="fas fa-robot"></i>
            <span>StyleHub Assistant</span>
        </div>
        <div class="chatbot-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    const chatbotBody = document.createElement('div');
    chatbotBody.className = 'chatbot-body';
    
    const chatbotMessages = document.createElement('div');
    chatbotMessages.className = 'chatbot-messages';
    
    const chatbotInput = document.createElement('div');
    chatbotInput.className = 'chatbot-input';
    chatbotInput.innerHTML = `
        <input type="text" placeholder="Type your message here...">
        <button><i class="fas fa-paper-plane"></i></button>
    `;
    
    // Assemble chatbot elements
    chatbotBody.appendChild(chatbotMessages);
    chatbotWindow.appendChild(chatbotHeader);
    chatbotWindow.appendChild(chatbotBody);
    chatbotWindow.appendChild(chatbotInput);
    chatbotContainer.appendChild(chatbotButton);
    chatbotContainer.appendChild(chatbotWindow);
    
    // Add chatbot to the page
    document.body.appendChild(chatbotContainer);
    
    // Add event listeners
    chatbotButton.addEventListener('click', function() {
        chatbotWindow.style.display = 'flex';
        chatbotButton.style.display = 'none';
        // Add welcome message if it's the first time opening
        if (chatbotMessages.children.length === 0) {
            addBotMessage("Hello! 👋 Welcome to StyleHub. How can I help you today?");
            setTimeout(() => {
                addBotMessage("You can ask me about our products, sizing, shipping, returns, or anything else you need help with!");
            }, 1000);
        }
    });
    
    chatbotHeader.querySelector('.chatbot-close').addEventListener('click', function() {
        chatbotWindow.style.display = 'none';
        chatbotButton.style.display = 'flex';
    });
    
    const inputField = chatbotInput.querySelector('input');
    const sendButton = chatbotInput.querySelector('button');
    
    function sendMessage() {
        const message = inputField.value.trim();
        if (message) {
            addUserMessage(message);
            inputField.value = '';
            processUserMessage(message);
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to add a user message to the chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add a bot message to the chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">${message}</div>
        `;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add a typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-message bot-message typing-indicator';
        typingElement.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        chatbotMessages.appendChild(typingElement);
        scrollToBottom();
        return typingElement;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator(element) {
        chatbotMessages.removeChild(element);
    }
    
    // Function to scroll to the bottom of the chat
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Function to process user messages and generate responses
    function processUserMessage(message) {
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Simulate processing time
        setTimeout(() => {
            removeTypingIndicator(typingIndicator);
            
            // Convert message to lowercase for easier matching
            const lowerMessage = message.toLowerCase();
            
            // Check for keywords and respond accordingly
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                addBotMessage("Hello there! How can I assist you with your shopping today?");
            }
            else if (lowerMessage.includes('help')) {
                addBotMessage("I'm here to help! You can ask me about our products, sizing, shipping, returns, or anything else you need assistance with.");
            }
            else if (lowerMessage.includes('product') || lowerMessage.includes('clothes') || lowerMessage.includes('clothing')) {
                addBotMessage("We offer a wide range of clothing items including t-shirts, jeans, dresses, sweaters, and accessories. You can browse our collection in the Shop section. Would you like me to help you find something specific?");
            }
            else if (lowerMessage.includes('size') || lowerMessage.includes('sizing')) {
                addBotMessage("Our products come in sizes XS to XXL. Each product page has a detailed size guide. If you're between sizes, we generally recommend sizing up for a more comfortable fit. Do you need help with a specific item?");
            }
            else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
                addBotMessage("We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Standard shipping is free for orders over $50. International shipping is available to most countries. Would you like more details about shipping to your location?");
            }
            else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
                addBotMessage("We have a 30-day return policy for all unworn items with tags attached. Returns can be initiated through your account or by contacting our customer service team. Would you like me to guide you through the return process?");
            }
            else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
                addBotMessage("We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed. Is there a specific payment method you'd like to know more about?");
            }
            else if (lowerMessage.includes('discount') || lowerMessage.includes('coupon') || lowerMessage.includes('promo')) {
                addBotMessage("You can find our current promotions on the homepage. New subscribers to our newsletter receive a 10% discount on their first order. Would you like to sign up for our newsletter?");
            }
            else if (lowerMessage.includes('contact') || lowerMessage.includes('human') || lowerMessage.includes('representative')) {
                addBotMessage("If you'd like to speak with a human representative, please email us at support@stylehub.com or call us at +1 234 567 890 during our business hours (Monday-Friday, 9AM-6PM EST). Would you like me to connect you with a representative?");
            }
            else if (lowerMessage.includes('thank')) {
                addBotMessage("You're welcome! Is there anything else I can help you with today?");
            }
            else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
                addBotMessage("Thank you for chatting with StyleHub Assistant! Feel free to come back if you have any more questions. Have a great day!");
            }
            else {
                addBotMessage("I'm not sure I understand. Could you please rephrase your question? You can ask about our products, sizing, shipping, returns, or contact information.");
            }
        }, 1500); // Simulate typing delay
    }
});

// Add CSS for the chatbot
const chatbotStyles = document.createElement('style');
chatbotStyles.innerHTML = `
    .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: 'Poppins', sans-serif;
    }
    
    .chatbot-button {
        width: 60px;
        height: 60px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }
    
    .chatbot-button:hover {
        transform: scale(1.1);
    }
    
    .chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    .chatbot-header {
        background-color: var(--primary-color);
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chatbot-title {
        display: flex;
        align-items: center;
        font-weight: 600;
    }
    
    .chatbot-title i {
        margin-right: 10px;
    }
    
    .chatbot-close {
        cursor: pointer;
        font-size: 18px;
    }
    
    .chatbot-body {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f5f5f5;
    }
    
    .chatbot-messages {
        display: flex;
        flex-direction: column;
    }
    
    .chatbot-message {
        margin-bottom: 15px;
        display: flex;
        align-items: flex-start;
    }
    
    .bot-message {
        align-self: flex-start;
    }
    
    .user-message {
        align-self: flex-end;
        flex-direction: row-reverse;
    }
    
    .bot-avatar {
        width: 30px;
        height: 30px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin-right: 10px;
    }
    
    .message-content {
        background-color: white;
        padding: 10px 15px;
        border-radius: 18px;
        max-width: 70%;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .bot-message .message-content {
        background-color: white;
        border-top-left-radius: 5px;
    }
    
    .user-message .message-content {
        background-color: var(--primary-color);
        color: white;
        border-top-right-radius: 5px;
    }
    
    .chatbot-input {
        display: flex;
        padding: 10px;
        background-color: white;
        border-top: 1px solid #eee;
    }
    
    .chatbot-input input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-family: 'Poppins', sans-serif;
    }
    
    .chatbot-input button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
    }
    
    .chatbot-input button:hover {
        background-color: #3a5bd0;
    }
    
    .typing-indicator .message-content {
        display: flex;
        align-items: center;
        padding: 15px;
    }
    
    .typing-indicator .dot {
        width: 8px;
        height: 8px;
        background-color: #888;
        border-radius: 50%;
        margin: 0 2px;
        animation: typing 1.5s infinite ease-in-out;
    }
    
    .typing-indicator .dot:nth-child(1) {
        animation-delay: 0s;
    }
    
    .typing-indicator .dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator .dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
        100% {
            transform: translateY(0);
        }
    }
    
    @media (max-width: 576px) {
        .chatbot-window {
            width: 300px;
            height: 450px;
            bottom: 70px;
            right: 0;
        }
    }
`;
document.head.appendChild(chatbotStyles);
