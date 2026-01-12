import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';

const EventSchedules = () => {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const mockEvents = [
    { id: 1, title: 'Tech Workshop', date: '2025-01-15', time: '10:00 AM - 12:00 PM', venue: 'Lab 101', status: 'Completed', checklistPercentage: 100 },
    { id: 2, title: 'Hackathon 2025', date: '2025-01-18', time: '09:00 AM - 05:00 PM', venue: 'Main Hall', status: 'In Progress', checklistPercentage: 60 },
    { id: 3, title: 'Code Sprint', date: '2025-01-22', time: '02:00 PM - 04:00 PM', venue: 'Room 205', status: 'Planned', checklistPercentage: 0 },
    { id: 4, title: 'AI Seminar', date: '2025-01-25', time: '11:00 AM - 01:00 PM', venue: 'Auditorium', status: 'Planned', checklistPercentage: 0 },
  ];

  useEffect(() => {
    scheduleService.getAll().then(res => {
      setEvents(res.data || mockEvents);
      setFilteredEvents(res.data || mockEvents);
    }).catch(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    });
  }, []);

  const applyDateFilter = () => {
    if (!fromDate && !toDate) {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date);
      const from = fromDate ? new Date(fromDate) : new Date('1900-01-01');
      const to = toDate ? new Date(toDate) : new Date('2100-12-31');
      return eventDate >= from && eventDate <= to;
    });
    setFilteredEvents(filtered);
  };

  const getStatusColor = (status) => {
    const colors = { 'Completed': 'status-completed', 'In Progress': 'status-progress', 'Planned': 'status-planned' };
    return colors[status] || 'status-planned';
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(e => e.date === dateStr);
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const getWeekDates = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    return Array.from({ length: 7 }, (_, i) => new Date(curr.setDate(first + i)));
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      days.push(
        <div key={day} className="calendar-day">
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map(event => (
              <div key={event.id} className={`event-pill ${getStatusColor(event.status)}`}>
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>←</button>
          <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={() => changeMonth(1)}>→</button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    const startDate = weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDate = weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return (
      <div className="week-container">
        <div className="week-header">
          <h2>{startDate} – {endDate}</h2>
        </div>
        <div className="week-grid">
          {weekDates.map((date, idx) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div key={idx} className="week-day">
                <div className="week-day-header">
                  <div className="week-day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="week-day-number">{date.getDate()}</div>
                </div>
                <div className="week-events">
                  {dayEvents.map(event => (
                    <div key={event.id} className={`week-event-card ${getStatusColor(event.status)}`}>
                      <div className="event-time">{event.time.split(' - ')[0]}</div>
                      <div className="event-title">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="list-container">
        <h2 className="list-title">All Events</h2>
        <div className="event-list">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-list-card">
              <div className="event-date-badge">
                <div className="date-day">{new Date(event.date).getDate()}</div>
                <div className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
              <div className="event-details">
                <h3 className="event-name">{event.title}</h3>
                <div className="event-meta">
                  <span>📍 {event.venue}</span>
                  <span>🕐 {event.time}</span>
                </div>
              </div>
              <div className="event-status-section">
                <span className={`status-badge ${getStatusColor(event.status)}`}>{event.status}</span>
                <div className="checklist-info">{event.checklistPercentage}% Checklist</div>
              </div>
              <div className="event-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <div>
          <h1 className="schedule-title">Event Schedule</h1>
          <p className="schedule-subtitle">View your club's event calendar</p>
        </div>
        <div className="live-datetime">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="view-controls-card">
        <div className="view-tabs">
          <button className={`view-tab ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>Month</button>
          <button className={`view-tab ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Week</button>
          <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
        </div>
        <div className="date-filters">
          <label className="filter-label">From</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="From" />
          <label className="filter-label">To</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} placeholder="To" />
          <button className="apply-filter-btn" onClick={() => applyDateFilter()}>🔍 Apply</button>
        </div>
      </div>

      <div className="schedule-content">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'list' && renderListView()}
      </div>
    </div>
  );
};

export default EventSchedules;
