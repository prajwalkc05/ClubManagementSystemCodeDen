import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';

const ScheduleMonitor = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [viewMode, setViewMode] = useState('Month');
  const [clubFilter, setClubFilter] = useState('All Clubs');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    scheduleService.getAll().then(res => setSchedules(res.data || [])).catch(() => {
      setSchedules([
        { id: 1, event: 'Tech Fest 2024', club: 'Tech Club', date: '2025-01-15', time: '10:00 AM', venue: 'Main Auditorium', status: 'Planned', color: 'blue' },
        { id: 2, event: 'Art Exhibition', club: 'Arts Club', date: '2025-01-20', time: '2:00 PM', venue: 'Art Gallery', status: 'In Progress', color: 'purple' },
        { id: 3, event: 'Sports Day', club: 'Sports Club', date: '2025-01-25', time: '9:00 AM', venue: 'Sports Ground', status: 'Planned', color: 'green' },
        { id: 4, event: 'Music Concert', club: 'Music Club', date: '2025-01-28', time: '6:00 PM', venue: 'Auditorium', status: 'Planned', color: 'orange' }
      ]);
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const hasEventOnDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find(s => s.date === dateStr);
  };

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const { firstDay, daysInMonth } = getDaysInMonth();

  return (
    <div className="page-container">
      <div className="page-header-faculty">
        <div>
          <h1>Global Schedule Monitor</h1>
          <p className="page-subtitle">View all club schedules (Read-Only)</p>
        </div>
        <div className="faculty-controls">
          <select className="faculty-select" value={clubFilter} onChange={e => setClubFilter(e.target.value)}>
            <option value="All Clubs">All Clubs</option>
            <option value="Tech Club">Tech Club</option>
            <option value="Arts Club">Arts Club</option>
            <option value="Sports Club">Sports Club</option>
          </select>
          <div className="view-toggle-group">
            {['Month', 'Week', 'List'].map(mode => (
              <button
                key={mode}
                className={`view-toggle-btn ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}>
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule-calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>←</button>
          <h2 className="calendar-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>→</button>
        </div>

        <div className="calendar-grid-faculty">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header-faculty">{day}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day-faculty empty"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const event = hasEventOnDate(day);
            return (
              <div key={day} className={`calendar-day-faculty ${event ? `has-event ${event.color}` : ''}`}>
                <span className="day-number-faculty">{day}</span>
                {event && <div className="event-dot-faculty"></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="upcoming-events-section">
        <h3 className="section-title-faculty">Upcoming Events</h3>
        <div className="upcoming-events-grid">
          {schedules.map(event => (
            <div key={event.id} className={`upcoming-event-card ${event.color}`}>
              <div className="event-card-content">
                <h4 className="event-title-faculty">{event.event}</h4>
                <p className="event-club-faculty">{event.club}</p>
                <div className="event-details-row">
                  <span className="event-detail">📅 {event.date}</span>
                  <span className="event-detail">🕒 {event.time}</span>
                </div>
                <p className="event-venue">📍 {event.venue}</p>
              </div>
              <span className={`status-badge-table ${event.status.toLowerCase().replace(' ', '-')}`}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMonitor;
