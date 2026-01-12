import { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');

  const mockMessages = [
    { id: 1, sender: 'Faculty Advisor', senderRole: 'Faculty', text: 'Please submit the event completion report by Friday.', time: '10:30 AM', date: 'Jan 20, 2025', isFromMe: false },
    { id: 2, sender: 'You', senderRole: 'Individual', text: 'Sure, I will submit it by tomorrow.', time: '10:35 AM', date: 'Jan 20, 2025', isFromMe: true },
    { id: 3, sender: 'Club Lead', senderRole: 'Club Lead', text: 'Team meeting scheduled for Monday at 3 PM. Please confirm attendance.', time: '02:15 PM', date: 'Jan 20, 2025', isFromMe: false },
    { id: 4, sender: 'Faculty Advisor', senderRole: 'Faculty', text: 'Great work on the last event! Keep it up.', time: '04:20 PM', date: 'Jan 19, 2025', isFromMe: false },
    { id: 5, sender: 'Club Lead', senderRole: 'Club Lead', text: 'Don\'t forget to upload attendance sheets for the workshop.', time: '09:00 AM', date: 'Jan 19, 2025', isFromMe: false },
  ];

  useEffect(() => {
    chatService.getMessages('club1').then(res => {
      setMessages(res.data || mockMessages);
    }).catch(() => {
      setMessages(mockMessages);
    });
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const profile = localStorage.getItem('individualProfile');
    const name = profile ? JSON.parse(profile).name : 'Alex Johnson';
    
    const message = {
      sender: name,
      senderRole: 'Individual',
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isFromMe: true
    };

    chatService.sendMessage('club1', newMessage).then(() => {
      setMessages([...messages, message]);
      setNewMessage('');
    }).catch(() => {
      setMessages([...messages, message]);
      setNewMessage('');
    });
  };

  const getSenderIcon = (role) => {
    const icons = {
      'Faculty': '👨‍🏫',
      'Club Lead': '👤',
      'Individual': '👤'
    };
    return icons[role] || '👤';
  };

  const getSenderColor = (role) => {
    const colors = {
      'Faculty': 'sender-faculty',
      'Club Lead': 'sender-lead',
      'Individual': 'sender-individual'
    };
    return colors[role] || 'sender-individual';
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <div>
          <h1 className="messages-title">💬 Communication</h1>
          <p className="messages-subtitle">Messages from Faculty and Club Lead</p>
        </div>
        <div className="live-datetime">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list-section">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.isFromMe ? 'message-me' : 'message-other'}`}>
              {!msg.isFromMe && (
                <div className="message-sender-info">
                  <span className={`sender-icon ${getSenderColor(msg.senderRole)}`}>
                    {getSenderIcon(msg.senderRole)}
                  </span>
                  <div>
                    <strong className="sender-name">{msg.sender}</strong>
                    <span className="sender-role">{msg.senderRole}</span>
                  </div>
                </div>
              )}
              <div className="message-content">
                <p className="message-text">{msg.text}</p>
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                  <span className="message-date">{msg.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="message-input-section">
          <div className="recipient-selector">
            <label>Send to:</label>
            <select value={selectedRecipient} onChange={e => setSelectedRecipient(e.target.value)}>
              <option value="all">All (Faculty & Club Lead)</option>
              <option value="faculty">Faculty Advisor</option>
              <option value="lead">Club Lead</option>
            </select>
          </div>
          <div className="message-input-wrapper">
            <textarea
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              rows="3"
            />
            <button className="send-btn" onClick={handleSendMessage}>
              📤 Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
