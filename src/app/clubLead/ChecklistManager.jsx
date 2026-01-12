import { useState, useEffect } from 'react';
import { checklistService } from '../../services/checklistService';

const ChecklistManager = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    { id: 1, name: 'Tech Fest 2024', club: 'Tech Club', date: 'Mar 15', status: 'In Progress', hasChecklist: false },
    { id: 2, name: 'Workshop Series', club: 'Arts Club', date: 'Mar 20', status: 'Planned', hasChecklist: false },
    { id: 3, name: 'Hackathon', club: 'Tech Club', date: 'Apr 5', status: 'In Progress', hasChecklist: false }
  ]);
  const [checklists, setChecklists] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState([{ name: '', description: '', mandatory: true }]);

  useEffect(() => {
    if (selectedEvent) {
      checklistService.getByEvent(selectedEvent.id)
        .then(res => {
          if (res.data) {
            setChecklists(prev => ({ ...prev, [selectedEvent.id]: res.data }));
          }
        })
        .catch(() => {});
    }
  }, [selectedEvent]);

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { name: '', description: '', mandatory: true }]);
  };

  const updateChecklistItem = (index, field, value) => {
    const updated = [...checklistItems];
    updated[index][field] = value;
    setChecklistItems(updated);
  };

  const removeChecklistItem = (index) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleCreateChecklist = () => {
    const newChecklist = {
      eventId: selectedEvent.id,
      items: checklistItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        status: 'pending',
        uploadedFile: null
      })),
      locked: false,
      completionPercentage: 0
    };

    checklistService.create(selectedEvent.id, checklistItems)
      .then(() => {
        setChecklists(prev => ({ ...prev, [selectedEvent.id]: newChecklist }));
        setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, hasChecklist: true } : e));
        setIsCreateModalOpen(false);
        setChecklistItems([{ name: '', description: '', mandatory: true }]);
      })
      .catch(() => {
        setChecklists(prev => ({ ...prev, [selectedEvent.id]: newChecklist }));
        setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, hasChecklist: true } : e));
        setIsCreateModalOpen(false);
        setChecklistItems([{ name: '', description: '', mandatory: true }]);
      });
  };

  const handleFileUpload = (itemId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const checklist = checklists[selectedEvent.id];
        const updatedItems = checklist.items.map(item => 
          item.id === itemId ? { ...item, status: 'uploaded', uploadedFile: file.name } : item
        );
        
        const mandatoryItems = updatedItems.filter(i => i.mandatory);
        const uploadedMandatory = mandatoryItems.filter(i => i.status === 'uploaded' || i.status === 'approved');
        const completion = Math.round((uploadedMandatory.length / mandatoryItems.length) * 100);
        const allUploaded = completion === 100;

        checklistService.uploadDocument(itemId, file)
          .then(() => {
            setChecklists(prev => ({
              ...prev,
              [selectedEvent.id]: {
                ...checklist,
                items: updatedItems,
                completionPercentage: completion,
                locked: allUploaded
              }
            }));
            if (allUploaded) {
              setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status: 'Completed' } : e));
            }
          })
          .catch(() => {
            setChecklists(prev => ({
              ...prev,
              [selectedEvent.id]: {
                ...checklist,
                items: updatedItems,
                completionPercentage: completion,
                locked: allUploaded
              }
            }));
            if (allUploaded) {
              setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status: 'Completed' } : e));
            }
          });
      }
    };
    input.click();
  };

  const currentChecklist = selectedEvent ? checklists[selectedEvent.id] : null;

  return (
    <div className="checklist-layout">
      <div className="checklist-sidebar">
        <h3 className="sidebar-title">Events</h3>
        <div className="event-list">
          {events.map(evt => (
            <div key={evt.id} className={`event-card ${selectedEvent?.id === evt.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(evt)}>
              <div className="event-card-header">
                <div>
                  <h4>{evt.name}</h4>
                  <span className="event-club-name">{evt.club}</span>
                </div>
                <span className={`status-badge ${evt.status.toLowerCase().replace(' ', '-')}`}>{evt.status}</span>
              </div>
              <div className="event-card-footer">
                <span className="event-date">📅 {evt.date}</span>
                {evt.hasChecklist && <span className="checklist-indicator">✓ Checklist</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="checklist-main">
        {selectedEvent ? (
          currentChecklist ? (
            <div className="checklist-content">
              <div className="checklist-header">
                <div>
                  <h3>Checklist for {selectedEvent.name}</h3>
                  {currentChecklist.locked && (
                    <div className="locked-banner">
                      🔒 Locked
                    </div>
                  )}
                </div>
                <div className="completion-section">
                  <div className="completion-text">{currentChecklist.completionPercentage}% Complete</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${currentChecklist.completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {currentChecklist.completionPercentage === 100 && (
                <div className="success-message">
                  ✓ All documents uploaded
                </div>
              )}

              <div className="checklist-items">
                {currentChecklist.items.map(item => (
                  <div key={item.id} className="checklist-item-card">
                    <div className="item-header">
                      <div className="item-title">
                        <span className={`status-icon ${item.status}`}>
                          {item.status === 'pending' && '⏳'}
                          {item.status === 'uploaded' && '✓'}
                          {item.status === 'approved' && '✅'}
                        </span>
                        <div>
                          <h4>{item.name}</h4>
                          {item.mandatory && <span className="mandatory-badge">★ Mandatory</span>}
                        </div>
                      </div>
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'pending' && 'Pending'}
                        {item.status === 'uploaded' && 'Uploaded'}
                        {item.status === 'approved' && 'Approved'}
                      </span>
                    </div>
                    <p className="item-description">{item.description}</p>
                    {item.uploadedFile && (
                      <div className="uploaded-file">
                        📄 {item.uploadedFile}
                      </div>
                    )}
                    {!currentChecklist.locked && item.status === 'pending' && (
                      <button className="btn-upload" onClick={() => handleFileUpload(item.id)}>
                        📄 Upload Document
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state-center">
              <div className="empty-icon">📄</div>
              <h3>No checklist created</h3>
              <p>Create a checklist for {selectedEvent.name}</p>
              <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>+ Create Checklist</button>
            </div>
          )
        ) : (
          <div className="empty-state-center">
            <div className="empty-icon">👈</div>
            <h3>Select an event</h3>
            <p>Choose an event to view or create checklist</p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Checklist</h3>
              <button onClick={() => setIsCreateModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateChecklist(); }} className="form-modern">
              <div className="checklist-form">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="checklist-form-item">
                    <div className="form-item-header">
                      <h4>Document {idx + 1}</h4>
                      {checklistItems.length > 1 && (
                        <button type="button" className="btn-remove" onClick={() => removeChecklistItem(idx)}>×</button>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Document Name</label>
                      <input type="text" placeholder="e.g., Event Proposal" value={item.name}
                        onChange={e => updateChecklistItem(idx, 'name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea placeholder="Brief description" value={item.description}
                        onChange={e => updateChecklistItem(idx, 'description', e.target.value)} rows="2" />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={item.mandatory}
                          onChange={e => updateChecklistItem(idx, 'mandatory', e.target.checked)} />
                        Mandatory Document
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary btn-block" onClick={addChecklistItem}>
                + Add Another Document
              </button>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Checklist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistManager;
