import { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';

const Communication = () => {
  const [userName, setUserName] = useState('Dr. Smith');
  const [messages, setMessages] = useState([]);
  const [scope, setScope] = useState('Everyone');
  const [selectedClub, setSelectedClub] = useState('');
  const [relatedEvent, setRelatedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [clubs] = useState(['Tech Club', 'Arts Club', 'Sports Club']);

  useEffect(() => {
    const profile = localStorage.getItem('facultyProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
    loadMessages();
  }, []);

  const loadMessages = () => {
    const profile = localStorage.getItem('facultyProfile');
    const name = profile ? JSON.parse(profile).name : 'Dr. Smith';
    chatService.getMessages('all').then(res => setMessages(res.data || [])).catch(() => {
      setMessages([
        { id: 1, author: `${name} (Faculty)`, scope: 'Everyone', message: 'Welcome to the new academic year!', time: '2 hours ago', event: null },
        { id: 2, author: 'John Doe (Club Lead)', scope: 'Tech Club', message: 'Hackathon registration is now open', time: '5 hours ago', event: 'Hackathon 2024' }
      ]);
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      author: `${userName} (Faculty)`,
      scope: scope === 'Particular Club' ? selectedClub : scope,
      message,
      time: 'Just now',
      event: relatedEvent || null
    };

    chatService.sendMessage('all', message).then(() => {
      setMessages([newMsg, ...messages]);
      setMessage('');
      setSelectedClub('');
      setRelatedEvent('');
    }).catch(() => {
      setMessages([newMsg, ...messages]);
      setMessage('');
      setSelectedClub('');
      setRelatedEvent('');
    });
  };

  return (
    <div className="communication-layout">
      <div className="compose-panel">
        <h3 className="panel-title">Faculty Communication</h3>
        <form onSubmit={handleSend} className="compose-form">
          <div className="form-group">
            <label>Message Scope</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" value="Everyone" checked={scope === 'Everyone'}
                  onChange={e => setScope(e.target.value)} />
                Everyone
              </label>
              <label className="radio-label">
                <input type="radio" value="Particular Club" checked={scope === 'Particular Club'}
                  onChange={e => setScope(e.target.value)} />
                Particular Club
              </label>
            </div>
          </div>

          {scope === 'Particular Club' && (
            <div className="form-group">
              <label>Select Club</label>
              <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)} required>
                <option value="">Choose a club</option>
                {clubs.map(club => <option key={club} value={club}>{club}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Related Event (Optional)</label>
            <select value={relatedEvent} onChange={e => setRelatedEvent(e.target.value)}>
              <option value="">None</option>
              <option value="Hackathon 2024">Hackathon 2024</option>
              <option value="Tech Fest">Tech Fest</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Type your message..." value={message}
              onChange={e => setMessage(e.target.value)} rows="6" required />
          </div>

          <button type="submit" className="btn-primary btn-block">Send Message</button>
        </form>
      </div>

      <div className="feed-panel">
        <h3 className="panel-title">Message Feed</h3>
        <div className="message-feed">
          {messages.map(msg => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <div className="message-author">{msg.author}</div>
              </div>
              <p className="message-text">{msg.message}</p>
              <div className="message-footer">
                <span className={`scope-badge ${msg.scope.toLowerCase().replace(' ', '-')}`}>
                  {msg.scope}
                </span>
                {msg.event && <span className="event-tag">📌 {msg.event}</span>}
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communication;
