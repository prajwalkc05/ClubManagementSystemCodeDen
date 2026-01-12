import { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { scheduleService } from '../../services/scheduleService';

const Dashboard = () => {
  const [userName, setUserName] = useState('Dr. Smith');
  const [stats, setStats] = useState({
    totalClubs: 0,
    activeEvents: 0,
    pendingDocs: 0,
    completedEvents: 0,
    complianceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [clubPerformance, setClubPerformance] = useState([]);

  useEffect(() => {
    const profile = localStorage.getItem('facultyProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    clubService.getAll().then(res => {
      const clubs = res.data || [];
      setStats({
        totalClubs: clubs.length,
        activeEvents: 12,
        pendingDocs: 5,
        completedEvents: 28,
        complianceRate: 94
      });
    }).catch(() => {
      setStats({
        totalClubs: 8,
        activeEvents: 12,
        pendingDocs: 5,
        completedEvents: 28,
        complianceRate: 94
      });
    });

    scheduleService.getAll().then(res => {
      setUpcomingEvents(res.data?.slice(0, 5) || [
        { id: 1, event: 'Tech Fest 2024', club: 'Tech Club', date: 'Mar 20', status: 'Planned' },
        { id: 2, event: 'Workshop Series', club: 'Arts Club', date: 'Mar 25', status: 'In Progress' }
      ]);
    }).catch(() => {
      setUpcomingEvents([
        { id: 1, event: 'Tech Fest 2024', club: 'Tech Club', date: 'Mar 20', status: 'Planned' },
        { id: 2, event: 'Workshop Series', club: 'Arts Club', date: 'Mar 25', status: 'In Progress' }
      ]);
    });

    setRecentActivities([
      { action: 'Document Uploaded', club: 'Tech Club', event: 'Hackathon', time: '2 hours ago', type: 'upload' },
      { action: 'Event Completed', club: 'Arts Club', event: 'Exhibition', time: '5 hours ago', type: 'complete' },
      { action: 'Schedule Created', club: 'Sports Club', event: 'Tournament', time: '1 day ago', type: 'schedule' }
    ]);

    setClubPerformance([
      { club: 'Tech Club', events: 12, completed: 10, compliance: 95 },
      { club: 'Arts Club', events: 8, completed: 7, compliance: 92 },
      { club: 'Sports Club', events: 10, completed: 8, compliance: 88 }
    ]);
  };

  return (
    <div className="faculty-dashboard">
      <div className="dashboard-welcome">
        <div>
          <h2>Welcome, {userName}</h2>
          <p>Academic Governance & Monitoring Dashboard</p>
        </div>
        <div className="academic-badge">
          <span className="badge-year">AY 2024-25</span>
          <span className="badge-compliance">✓ NAAC Ready</span>
        </div>
      </div>

      <div className="stats-grid-faculty">
        <div className="stat-card-faculty blue">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalClubs}</div>
            <div className="stat-label">Total Clubs</div>
          </div>
        </div>
        <div className="stat-card-faculty green">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeEvents}</div>
            <div className="stat-label">Active Events</div>
          </div>
        </div>
        <div className="stat-card-faculty orange">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingDocs}</div>
            <div className="stat-label">Pending Documents</div>
          </div>
        </div>
        <div className="stat-card-faculty purple">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedEvents}</div>
            <div className="stat-label">Completed Events</div>
          </div>
        </div>
        <div className="stat-card-faculty gradient">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.complianceRate}%</div>
            <div className="stat-label">Compliance Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-faculty">
        <div className="dashboard-panel-faculty">
          <div className="panel-header-faculty">
            <h3>Recent Activities</h3>
            <span className="view-all">View All →</span>
          </div>
          <div className="activity-timeline">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="timeline-item">
                <div className={`timeline-dot ${activity.type}`}></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{activity.action}</strong>
                    <span className="timeline-time">{activity.time}</span>
                  </div>
                  <div className="timeline-details">
                    {activity.club} • {activity.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel-faculty">
          <div className="panel-header-faculty">
            <h3>Upcoming Events</h3>
            <span className="view-all">View All →</span>
          </div>
          <div className="events-list-faculty">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-item-faculty">
                <div className="event-date-badge">{event.date}</div>
                <div className="event-details-faculty">
                  <h4>{event.event}</h4>
                  <p>{event.club}</p>
                </div>
                <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="performance-panel">
        <div className="panel-header-faculty">
          <h3>Club Performance Overview</h3>
          <select className="filter-select">
            <option>Current Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="performance-grid">
          {clubPerformance.map((club, idx) => (
            <div key={idx} className="performance-card">
              <div className="performance-header">
                <h4>{club.club}</h4>
                <div className="compliance-circle" style={{ background: `conic-gradient(#10b981 ${club.compliance * 3.6}deg, #e5e7eb 0deg)` }}>
                  <span>{club.compliance}%</span>
                </div>
              </div>
              <div className="performance-stats">
                <div className="perf-stat">
                  <span className="perf-label">Total Events</span>
                  <span className="perf-value">{club.events}</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-label">Completed</span>
                  <span className="perf-value">{club.completed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
