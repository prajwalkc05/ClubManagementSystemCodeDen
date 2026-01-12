import { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';

const Communication = () => {
  const [userName, setUserName] = useState('John Doe');
  const [scope, setScope] = useState('Everyone');
  const [selectedClub, setSelectedClub] = useState('');
  const [relatedEvent, setRelatedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [editingMsg, setEditingMsg] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const profile = localStorage.getItem('clubLeadProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
    setMessages([
      { id: 1, author: profile ? JSON.parse(profile).name : 'John Doe', scope: 'Everyone', message: 'Welcome to the new academic year!', time: '2 hours ago', event: null },
      { id: 2, author: 'Jane Smith', scope: 'Tech Club', message: 'Hackathon registration is now open', time: '5 hours ago', event: 'Hackathon 2024' }
    ]);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    const newMsg = {
      id: messages.length + 1,
      author: userName,
      scope: scope === 'Particular Club' ? selectedClub : scope,
      message,
      time: 'Just now',
      event: relatedEvent || null
    };
    chatService.sendMessage('all', message).then(() => {
      setMessages([newMsg, ...messages]);
      setMessage('');
    }).catch(() => {});
  };

  const handleEdit = (msg) => {
    setEditingMsg(msg);
    setIsEditModalOpen(true);
  };

  const handleUpdateMessage = (e) => {
    e.preventDefault();
    chatService.updateMessage(editingMsg.id, editingMsg.message).then(() => {
      setMessages(messages.map(m => m.id === editingMsg.id ? editingMsg : m));
      setIsEditModalOpen(false);
      setEditingMsg(null);
    }).catch(() => {
      setMessages(messages.map(m => m.id === editingMsg.id ? editingMsg : m));
      setIsEditModalOpen(false);
      setEditingMsg(null);
    });
  };

  const handleDelete = (msgId) => {
    if (confirm('Delete this message?')) {
      chatService.deleteMessage(msgId).then(() => {
        setMessages(messages.filter(m => m.id !== msgId));
      }).catch(() => {
        setMessages(messages.filter(m => m.id !== msgId));
      });
    }
  };

  return (
    <div className="communication-layout">
      <div className="compose-panel">
        <h3 className="panel-title">Compose Message</h3>
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
                <option value="Tech Club">Tech Club</option>
                <option value="Arts Club">Arts Club</option>
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

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked disabled />
              Faculty Visibility
            </label>
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
                <div className="message-actions">
                  <button className="icon-btn" onClick={() => handleEdit(msg)} title="Edit">✏️</button>
                  <button className="icon-btn" onClick={() => handleDelete(msg.id)} title="Delete">🗑️</button>
                </div>
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

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Message</h3>
              <button onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpdateMessage} className="form-modern">
              <div className="form-group">
                <label>Message</label>
                <textarea value={editingMsg?.message || ''} 
                  onChange={e => setEditingMsg({...editingMsg, message: e.target.value})}
                  rows="6" required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
