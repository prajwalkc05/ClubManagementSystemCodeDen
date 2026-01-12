import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';

const EventCompletion = () => {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024-25');

  useEffect(() => {
    loadEvents();
  }, [selectedYear]);

  const loadEvents = () => {
    scheduleService.getAll().then(res => setEvents(res.data || [])).catch(() => {
      setEvents([
        { 
          id: 1, 
          name: 'Tech Fest 2024', 
          club: 'Tech Club', 
          date: '2024-03-20', 
          status: 'Completed',
          progress: 100,
          checklist: [
            { name: 'Event Report', uploaded: true },
            { name: 'Photos', uploaded: true },
            { name: 'Attendance', uploaded: true },
            { name: 'Budget', uploaded: true }
          ]
        },
        { 
          id: 2, 
          name: 'Art Exhibition', 
          club: 'Arts Club', 
          date: '2024-03-25', 
          status: 'In Progress',
          progress: 75,
          checklist: [
            { name: 'Event Report', uploaded: true },
            { name: 'Photos', uploaded: true },
            { name: 'Attendance', uploaded: true },
            { name: 'Budget', uploaded: false }
          ]
        },
        { 
          id: 3, 
          name: 'Sports Tournament', 
          club: 'Sports Club', 
          date: '2024-04-05', 
          status: 'Planned',
          progress: 0,
          checklist: [
            { name: 'Event Report', uploaded: false },
            { name: 'Photos', uploaded: false },
            { name: 'Attendance', uploaded: false },
            { name: 'Budget', uploaded: false }
          ]
        }
      ]);
    });
  };

  return (
    <div className="page-container">
      <div className="page-header-faculty">
        <div>
          <h1>Event Completion Monitoring</h1>
          <p className="page-subtitle">Track event status and document checklist completion</p>
        </div>
        <select className="premium-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          <option value="2024-25">Academic Year: 2024-25</option>
          <option value="2023-24">Academic Year: 2023-24</option>
        </select>
      </div>

      <div className="system-rule-banner">
        ⚠️ Event status is system-driven based on document checklist completion. Faculty cannot manually change event status.
      </div>

      <div className="event-completion-grid">
        {events.map(event => (
          <div key={event.id} className="event-completion-card">
            <div className="event-completion-header">
              <div>
                <h3>{event.name}</h3>
                <p className="event-club-text">{event.club} • {event.date}</p>
              </div>
              <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
                {event.status}
              </span>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Document Checklist</span>
                <span className="progress-percentage">{event.progress}%</span>
              </div>
              <div className="progress-bar-large">
                <div className="progress-fill-large" style={{ width: `${event.progress}%` }}></div>
              </div>
            </div>

            <div className="checklist-items-compact">
              {event.checklist.map((item, idx) => (
                <div key={idx} className="checklist-item-compact">
                  <span className={`check-icon ${item.uploaded ? 'uploaded' : 'missing'}`}>
                    {item.uploaded ? '✓' : '✗'}
                  </span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCompletion;
