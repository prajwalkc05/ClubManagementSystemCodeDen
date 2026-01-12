import { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';

const ChecklistUpload = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [stats, setStats] = useState({ completed: 0, total: 0, percentage: 0 });

  const events = [
    { id: 1, name: 'Tech Workshop 2025', date: 'Jan 15, 2025' },
    { id: 2, name: 'Hackathon 2025', date: 'Jan 18, 2025' },
    { id: 3, name: 'Code Sprint', date: 'Jan 22, 2025' },
  ];

  const mockChecklist = [
    { id: 1, name: 'Event Proposal', description: 'Detailed event proposal with objectives', required: true, status: 'Approved', uploadedFile: 'proposal.pdf', uploadDate: 'Jan 10, 2025', rejectionReason: '' },
    { id: 2, name: 'Budget Sheet', description: 'Complete budget breakdown', required: true, status: 'Reviewed', uploadedFile: 'budget.xlsx', uploadDate: 'Jan 11, 2025', rejectionReason: '' },
    { id: 3, name: 'Venue Booking', description: 'Venue confirmation document', required: true, status: 'Rejected', uploadedFile: 'venue_old.pdf', uploadDate: 'Jan 12, 2025', rejectionReason: 'Venue booking date mismatch. Please upload correct booking confirmation.' },
    { id: 4, name: 'Attendance Sheet', description: 'Participant attendance record', required: true, status: 'Pending', uploadedFile: '', uploadDate: '', rejectionReason: '' },
    { id: 5, name: 'Event Photos', description: 'High-quality event photographs', required: false, status: 'Pending', uploadedFile: '', uploadDate: '', rejectionReason: '' },
  ];

  useEffect(() => {
    if (selectedEvent) {
      documentService.getByEvent(selectedEvent).then(res => {
        setChecklist(res.data || mockChecklist);
        calculateStats(res.data || mockChecklist);
      }).catch(() => {
        setChecklist(mockChecklist);
        calculateStats(mockChecklist);
      });
    }
  }, [selectedEvent]);

  const calculateStats = (items) => {
    const total = items.length;
    const completed = items.filter(item => item.status === 'Approved').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    setStats({ completed, total, percentage });
  };

  const handleUpload = (itemId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.zip';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          alert('File size exceeds 50MB limit');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('checklistId', itemId);
        documentService.upload(formData).then(() => {
          const updated = checklist.map(item => 
            item.id === itemId ? { ...item, uploadedFile: file.name, uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'Reviewed' } : item
          );
          setChecklist(updated);
          calculateStats(updated);
          alert('Document uploaded successfully');
        }).catch(() => {
          alert('Upload failed. Please try again.');
        });
      }
    };
    input.click();
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Approved': '✅',
      'Reviewed': '👁',
      'Rejected': '❌',
      'Pending': '⏳'
    };
    return icons[status] || '⏳';
  };

  const getStatusClass = (status) => {
    const classes = {
      'Approved': 'status-approved',
      'Reviewed': 'status-reviewed',
      'Rejected': 'status-rejected',
      'Pending': 'status-pending'
    };
    return classes[status] || 'status-pending';
  };

  return (
    <div className="checklist-page">
      <div className="checklist-header">
        <div>
          <h1 className="checklist-title">Upload documents against event checklists</h1>
        </div>
        <div className="live-datetime">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="event-selector-section">
        <div className="event-selector-wrapper">
          <label className="selector-label">Select Event</label>
          <select className="event-selector" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
            <option value="">Choose an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} – {event.date}
              </option>
            ))}
          </select>
        </div>
        {selectedEvent && (
          <div className="progress-cards">
            <div className="progress-card">
              <div className="progress-value">{stats.percentage}%</div>
              <div className="progress-label">Completed</div>
            </div>
            <div className="progress-card">
              <div className="progress-value">{stats.completed} / {stats.total}</div>
              <div className="progress-label">Uploaded</div>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="checklist-section">
          <h2 className="checklist-section-title">
            📑 Document Checklist – {events.find(e => e.id == selectedEvent)?.name}
          </h2>
          <div className="checklist-items">
            {checklist.map(item => (
              <div key={item.id} className="checklist-item-card">
                <div className="item-left">
                  <div className="item-status-icon">{getStatusIcon(item.status)}</div>
                  <div className="item-info">
                    <div className="item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <span className={`item-badge ${item.required ? 'badge-required' : 'badge-optional'}`}>
                        {item.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <p className="item-description">{item.description}</p>
                    {item.uploadedFile && (
                      <div className="uploaded-info">
                        <span className="file-name">📎 {item.uploadedFile}</span>
                        <span className="upload-date">Uploaded: {item.uploadDate}</span>
                      </div>
                    )}
                    {item.status === 'Rejected' && item.rejectionReason && (
                      <div className="rejection-alert">
                        <strong>⚠️ Rejection Reason:</strong>
                        <p>{item.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="item-right">
                  <span className={`status-badge-large ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                  {item.status === 'Pending' && (
                    <button className="upload-btn" onClick={() => handleUpload(item.id)}>
                      📤 Upload
                    </button>
                  )}
                  {item.status === 'Rejected' && (
                    <button className="reupload-btn" onClick={() => handleUpload(item.id)}>
                      🔄 Re-upload
                    </button>
                  )}
                  {(item.status === 'Pending' || item.status === 'Rejected') && (
                    <div className="file-info-text">
                      <small>PDF, JPG, PNG, ZIP</small>
                      <small>Max 50MB</small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedEvent && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Select an event to view checklist</h3>
          <p>Choose an event from the dropdown above to start uploading documents</p>
        </div>
      )}
    </div>
  );
};

export default ChecklistUpload;
