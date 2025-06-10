(async () => {
  const myUser = await generateRandomUser();
  let activeUsers = [];
  let typingUsers = [];

  const socket = new WebSocket(generateBackendUrl());
  socket.addEventListener('open', () => {
    console.log('WebSocket connected!');
    socket.send(JSON.stringify({ type: 'newUser', user: myUser }));
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message:', message);
    switch (message.type) {
      case 'message':
        const messageElement = generateMessage(message, myUser);
        document.getElementById('messages').appendChild(messageElement);
        setTimeout(() => {
          messageElement.classList.add('opacity-100');
        }, 100);
        break;
      case 'activeUsers':
        activeUsers = message.users;
        updateActiveUsersList();
        break;
      case 'typing':
        typingUsers = message.users;
        updateTypingIndicator();
        break;
      default:
        break;
    }
  });
  socket.addEventListener('close', (event) => {
    console.log('WebSocket closed.');
  });
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  // Wait until the DOM is loaded before adding event listeners
  document.addEventListener('DOMContentLoaded', (event) => {
    // Send a message when the send button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    });
  });

  document.addEventListener('keydown', (event) => {
    // Only send if the typed in key is not a modifier key
    if (event.key.length === 1) {
      socket.send(JSON.stringify({ type: 'typing', user: myUser }));
    }
    // Only send if the typed in key is the enter key
    if (event.key === 'Enter') {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    }
  });

  // Function to update typing indicator
  const updateTypingIndicator = () => {
    const typingIndicator = document.getElementById('typingIndicator');
    const otherTypingUsers = typingUsers.filter(user => user.id !== myUser.id);
    
    if (otherTypingUsers.length === 0) {
      typingIndicator.classList.add('hidden');
    } else {
      const names = otherTypingUsers.map(user => user.name || user.username);
      let text;
      if (names.length === 1) {
        text = `${names[0]} schreibt gerade...`;
      } else if (names.length === 2) {
        text = `${names[0]} und ${names[1]} schreiben gerade...`;
      } else {
        text = `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]} schreiben gerade...`;
      }
      typingIndicator.textContent = text;
      typingIndicator.classList.remove('hidden');
    }
  };

  // Function to update active users list
  const updateActiveUsersList = () => {
    const activeUsersList = document.getElementById('activeUsersList');
    activeUsersList.innerHTML = '';
    
    activeUsers.forEach(user => {
      const userElement = document.createElement('div');
      userElement.className = 'flex items-center space-x-2 p-2 bg-gray-600 rounded';
      
      const statusDot = document.createElement('div');
      statusDot.className = 'w-2 h-2 bg-green-400 rounded-full';
      
      const userName = document.createElement('span');
      userName.className = 'text-white text-sm';
      userName.textContent = user.id === myUser.id ? `${user.name || user.username} (You)` : (user.name || user.username);
      
      userElement.appendChild(statusDot);
      userElement.appendChild(userName);
      activeUsersList.appendChild(userElement);
    });
  };
})();
