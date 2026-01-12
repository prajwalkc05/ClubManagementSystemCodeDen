import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [viewMode, setViewMode] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({ event: '', club: '', date: '', time: '', venue: '' });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    scheduleService.getAll().then(res => setSchedules(res.data || [])).catch(() => {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = { ...formData, id: Date.now(), status: 'Planned' };
    scheduleService.create(formData).then(() => {
      setSchedules([...schedules, newSchedule]);
      setIsModalOpen(false);
      setFormData({ event: '', club: '', date: '', time: '', venue: '' });
    }).catch(() => {
      setSchedules([...schedules, newSchedule]);
      setIsModalOpen(false);
      setFormData({ event: '', club: '', date: '', time: '', venue: '' });
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const hasEventOnDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.some(s => s.date === dateStr);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.filter(s => s.date === dateStr);
  };

  const changeMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="page-container">
      <div className="page-actions">
        <div className="view-toggle">
          <button className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}>📅 Calendar</button>
          <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}>📋 List</button>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Create Schedule
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-view">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>◀</button>
            <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
            <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>▶</button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {Array.from({ length: getDaysInMonth().firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}
            {Array.from({ length: getDaysInMonth().daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasEvent = hasEventOnDate(day);
              const events = getEventsForDate(day);
              return (
                <div key={day} className={`calendar-day ${hasEvent ? 'has-event' : ''}`}
                  onClick={() => hasEvent && setSelectedDate({ day, events })}>
                  <span className="day-number">{day}</span>
                  {hasEvent && (
                    <div className="event-indicators">
                      {events.slice(0, 2).map((evt, idx) => (
                        <div key={idx} className="event-dot" title={evt.event}></div>
                      ))}
                      {events.length > 2 && <span className="event-more">+{events.length - 2}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selectedDate && (
            <div className="calendar-events-popup">
              <div className="popup-header">
                <h4>Events on {monthNames[currentMonth.getMonth()]} {selectedDate.day}</h4>
                <button onClick={() => setSelectedDate(null)}>×</button>
              </div>
              <div className="popup-events">
                {selectedDate.events.map((evt, idx) => (
                  <div key={idx} className="popup-event">
                    <strong>{evt.event}</strong>
                    <span>{evt.club} - {evt.time || '10:00 AM'}</span>
                    <span>{evt.venue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Club</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? schedules.map((sch, idx) => (
                <tr key={idx}>
                  <td>{sch.event || 'Event Name'}</td>
                  <td>{sch.club || 'Club Name'}</td>
                  <td>{sch.date || 'Mar 15, 2024'} {sch.time || '10:00 AM'}</td>
                  <td>{sch.venue || 'Auditorium'}</td>
                  <td><span className={`status-badge ${(sch.status || 'Planned').toLowerCase().replace(' ', '-')}`}>
                    {sch.status || 'Planned'}</span></td>
                  <td>
                    <button className="icon-btn" title="Edit">✏️</button>
                    <button className="icon-btn" title="Delete" onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))}>🗑️</button>
                    <button className="icon-btn" title="Lock">🔒</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="empty-state">No schedules found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Schedule</h3>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modern">
              <div className="form-group">
                <label>Activity Title</label>
                <input type="text" placeholder="Enter event name" value={formData.event}
                  onChange={e => setFormData({...formData, event: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Assign to Club</label>
                <select value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} required>
                  <option value="">Select Club</option>
                  <option value="Tech Club">Tech Club</option>
                  <option value="Arts Club">Arts Club</option>
                  <option value="Sports Club">Sports Club</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input type="text" placeholder="Enter venue" value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
