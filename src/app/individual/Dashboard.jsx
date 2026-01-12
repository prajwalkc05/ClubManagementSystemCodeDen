import { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { scheduleService } from '../../services/scheduleService';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clubInfo, setClubInfo] = useState(null);
  const [stats, setStats] = useState({ totalEvents: 0, completed: 0, inProgress: 0, pending: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = () => {
    clubService.getAll().then(res => {
      setClubInfo(res.data?.club || null);
      setStats(res.data?.stats || {});
      setUpcomingEvents(res.data?.events || []);
    }).catch(() => {
      setClubInfo({
        name: 'Tech Club',
        initials: 'TC',
        department: 'Computer Science',
        status: 'Active',
        academicYear: 'AY 2024-25',
        clubId: 'CLB-2024-001'
      });
      setStats({
        totalEvents: 24,
        completed: 18,
        completedPercentage: 75,
        inProgress: 3,
        actionRequired: true,
        pending: 3
      });
      setUpcomingEvents([
        { id: 1, title: 'Tech Fest 2024', date: '15', month: 'MAR', venue: 'Main Auditorium', status: 'In Progress', isActive: true },
        { id: 2, title: 'AI Workshop', date: '22', month: 'MAR', venue: 'Lab 301', status: 'Planned', isActive: false },
        { id: 3, title: 'Hackathon', date: '05', month: 'APR', venue: 'Innovation Center', status: 'Planned', isActive: false }
      ]);
    });
  };

  const formatDateTime = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="page-container">
      <div className="page-header-individual">
        <div>
          <h1>Club Overview</h1>
          <p className="page-subtitle">View your club details and statistics</p>
        </div>
        <div className="live-datetime">
          <span className="live-indicator"></span>
          {formatDateTime(currentTime)}
        </div>
      </div>

      {clubInfo && (
        <div className="club-info-card">
          <div className="club-info-left">
            <div className="club-logo">{clubInfo.initials}</div>
            <div className="club-details">
              <h2 className="club-name">{clubInfo.name}</h2>
              <p className="club-department">{clubInfo.department}</p>
              <div className="club-meta">
                <span className="status-badge-club active">{clubInfo.status}</span>
                <span className="academic-year-badge">{clubInfo.academicYear}</span>
              </div>
            </div>
          </div>
          <div className="club-id-badge">Club ID: {clubInfo.clubId}</div>
        </div>
      )}

      <div className="stats-grid-individual">
        <div className="stat-card-individual">
          <div className="stat-icon-individual blue">📅</div>
          <div className="stat-info">
            <div className="stat-value-individual">{stats.totalEvents}</div>
            <div className="stat-label-individual">Total Events</div>
            <div className="stat-subtext">This academic year</div>
          </div>
        </div>

        <div className="stat-card-individual">
          <div className="stat-icon-individual green">✅</div>
          <div className="stat-info">
            <div className="stat-value-individual">{stats.completed}</div>
            <div className="stat-label-individual">Completed</div>
            <div className="progress-bar-small">
              <div className="progress-fill-small" style={{ width: `${stats.completedPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card-individual">
          <div className="stat-icon-individual orange">⏳</div>
          <div className="stat-info">
            <div className="stat-value-individual">{stats.inProgress}</div>
            <div className="stat-label-individual">In Progress</div>
            {stats.actionRequired && <div className="action-required">⚠️ Action Required</div>}
          </div>
        </div>

        <div className="stat-card-individual">
          <div className="stat-icon-individual purple">📋</div>
          <div className="stat-info">
            <div className="stat-value-individual">{stats.pending}</div>
            <div className="stat-label-individual">Pending</div>
            <div className="stat-subtext">Scheduled upcoming</div>
          </div>
        </div>
      </div>

      <div className="upcoming-events-section-individual">
        <h3 className="section-title-individual">Upcoming Events</h3>
        <div className="upcoming-events-grid-individual">
          {upcomingEvents.map(event => (
            <div key={event.id} className={`event-card-individual ${event.isActive ? 'active' : ''}`}>
              <div className="event-date-block">
                <div className="event-day">{event.date}</div>
                <div className="event-month">{event.month}</div>
              </div>
              <div className="event-info-individual">
                <h4 className="event-title-individual">{event.title}</h4>
                <p className="event-venue-individual">📍 {event.venue}</p>
                <span className={`status-badge-event ${event.status.toLowerCase().replace(' ', '-')}`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
