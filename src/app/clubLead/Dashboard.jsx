import { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { scheduleService } from '../../services/scheduleService';

const Dashboard = () => {
  const [stats, setStats] = useState({ activeClubs: 0, upcomingEvents: 0, pendingDocs: 0, messages: 0 });
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    clubService.getAll().then(res => {
      setStats({ activeClubs: res.data?.length || 5, upcomingEvents: 8, pendingDocs: 3, messages: 12 });
      setClubs(res.data?.slice(0, 3) || []);
    }).catch(() => {});
    
    scheduleService.getAll().then(res => setEvents(res.data?.slice(0, 4) || [])).catch(() => {});
    
    setActivities([
      { action: 'Created new club', entity: 'Tech Club', time: '2 hours ago', status: 'Created' },
      { action: 'Scheduled event', entity: 'Hackathon 2024', time: '5 hours ago', status: 'Scheduled' },
      { action: 'Document uploaded', entity: 'Event Report', time: '1 day ago', status: 'Uploaded' }
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-value">{stats.activeClubs}</div>
          <div className="stat-label">Active Clubs</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{stats.upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">{stats.pendingDocs}</div>
          <div className="stat-label">Pending Documents</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{stats.messages}</div>
          <div className="stat-label">Messages</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3 className="panel-title">Recent Activities</h3>
          <div className="activity-list">
            {activities.map((act, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-info">
                  <div className="activity-action">{act.action}</div>
                  <div className="activity-entity">{act.entity}</div>
                </div>
                <div className="activity-meta">
                  <span className={`status-badge ${act.status.toLowerCase()}`}>{act.status}</span>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">Upcoming Events</h3>
          <div className="event-list">
            {events.length > 0 ? events.map((evt, idx) => (
              <div key={idx} className="event-item">
                <div className="event-date">{evt.date || 'Mar 15'}</div>
                <div className="event-details">
                  <div className="event-name">{evt.event || 'Workshop'}</div>
                  <div className="event-club">{evt.club || 'Tech Club'}</div>
                </div>
              </div>
            )) : (
              <div className="empty-state">No upcoming events</div>
            )}
          </div>
        </div>
      </div>

      <div className="club-status-section">
        <h3 className="section-title">Club Status Overview</h3>
        <div className="club-cards">
          {clubs.length > 0 ? clubs.map((club, idx) => (
            <div key={idx} className="club-status-card">
              <div className="club-header">
                <h4>{club.name || 'Club Name'}</h4>
                <span className="status-badge active">Active</span>
              </div>
              <div className="club-stats">
                <div className="club-stat">
                  <span className="stat-num">{club.members || 45}</span>
                  <span className="stat-text">Members</span>
                </div>
                <div className="club-stat">
                  <span className="stat-num">{club.events || 3}</span>
                  <span className="stat-text">Events</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state">No clubs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
