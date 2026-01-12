import { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';

const AuditLogs = () => {
  const [clubFilter, setClubFilter] = useState('All Clubs');
  const [stats, setStats] = useState({ totalEvents: 45, completedEvents: 32, incompleteEvents: 8, pendingDocs: 15 });
  const [clubs, setClubs] = useState([]);
  const [missingDocs, setMissingDocs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    auditService.getLogs({}).then(res => {
      setClubs(res.data?.clubs || []);
      setMissingDocs(res.data?.missingDocs || []);
    }).catch(() => {
      setClubs([
        { id: 1, name: 'Tech Club', icon: '💻', totalEvents: 12, completed: 9, incomplete: 2, pendingDocs: 4, compliance: 75 },
        { id: 2, name: 'Arts Club', icon: '🎨', totalEvents: 8, completed: 7, incomplete: 1, pendingDocs: 2, compliance: 88 },
        { id: 3, name: 'Sports Club', icon: '⚽', totalEvents: 10, completed: 8, incomplete: 2, pendingDocs: 3, compliance: 80 },
        { id: 4, name: 'Music Club', icon: '🎵', totalEvents: 7, completed: 5, incomplete: 1, pendingDocs: 3, compliance: 71 },
        { id: 5, name: 'Drama Club', icon: '🎭', totalEvents: 8, completed: 3, incomplete: 2, pendingDocs: 3, compliance: 38 }
      ]);
      setMissingDocs([
        { id: 1, event: 'Tech Fest 2024', club: 'Tech Club', missing: ['Budget Report', 'Attendance Sheet', 'Final Report'], count: 3 },
        { id: 2, event: 'Art Exhibition', club: 'Arts Club', missing: ['Event Photos', 'Feedback Form'], count: 2 },
        { id: 3, event: 'Sports Tournament', club: 'Sports Club', missing: ['Medical Certificates', 'Venue Booking', 'Equipment List'], count: 3 }
      ]);
    });
  };

  const filteredClubs = clubFilter === 'All Clubs' ? clubs : clubs.filter(c => c.name === clubFilter);
  const filteredMissing = clubFilter === 'All Clubs' ? missingDocs : missingDocs.filter(m => m.club === clubFilter);

  const handleExport = () => {
    alert('Exporting compliance report...');
  };

  return (
    <div className="page-container">
      <div className="page-header-faculty">
        <div>
          <h1>Audit & Compliance Dashboard</h1>
          <p className="page-subtitle">Monitor compliance status across all clubs</p>
        </div>
        <div className="faculty-controls">
          <select className="faculty-select" value={clubFilter} onChange={e => setClubFilter(e.target.value)}>
            <option>All Clubs</option>
            <option>Tech Club</option>
            <option>Arts Club</option>
            <option>Sports Club</option>
            <option>Music Club</option>
            <option>Drama Club</option>
          </select>
          <button className="btn-export" onClick={handleExport}>📊 Export Report</button>
        </div>
      </div>

      <div className="stats-grid-audit">
        <div className="stat-card-audit blue">
          <div className="stat-icon-audit">📅</div>
          <div className="stat-content-audit">
            <div className="stat-value-audit">{stats.totalEvents}</div>
            <div className="stat-label-audit">Total Events</div>
          </div>
        </div>
        <div className="stat-card-audit green">
          <div className="stat-icon-audit">✅</div>
          <div className="stat-content-audit">
            <div className="stat-value-audit">{stats.completedEvents}</div>
            <div className="stat-label-audit">Completed Events</div>
          </div>
        </div>
        <div className="stat-card-audit yellow">
          <div className="stat-icon-audit">⏳</div>
          <div className="stat-content-audit">
            <div className="stat-value-audit">{stats.incompleteEvents}</div>
            <div className="stat-label-audit">Incomplete Events</div>
          </div>
        </div>
        <div className="stat-card-audit red">
          <div className="stat-icon-audit">📄</div>
          <div className="stat-content-audit">
            <div className="stat-value-audit">{stats.pendingDocs}</div>
            <div className="stat-label-audit">Pending Documents</div>
          </div>
        </div>
      </div>

      <div className="compliance-table-container">
        <h3 className="section-title-audit">Club Compliance Summary</h3>
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Total Events</th>
              <th>Completed</th>
              <th>Incomplete</th>
              <th>Pending Docs</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map(club => (
              <tr key={club.id}>
                <td>
                  <div className="club-name-cell">
                    <span className="club-icon-table">{club.icon}</span>
                    <span>{club.name}</span>
                  </div>
                </td>
                <td>{club.totalEvents}</td>
                <td><span className="count-green">{club.completed}</span></td>
                <td><span className="count-orange">{club.incomplete}</span></td>
                <td><span className="count-red">{club.pendingDocs}</span></td>
                <td>
                  <div className="compliance-cell">
                    <div className="compliance-bar-container">
                      <div className="compliance-bar-fill" style={{ width: `${club.compliance}%`, backgroundColor: club.compliance >= 75 ? '#10b981' : club.compliance >= 50 ? '#f59e0b' : '#ef4444' }}></div>
                    </div>
                    <span className="compliance-percentage">{club.compliance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMissing.length > 0 && (
        <div className="missing-docs-section">
          <h3 className="section-title-audit">Events with Missing Documents</h3>
          <div className="missing-docs-list">
            {filteredMissing.map(item => (
              <div key={item.id} className="missing-doc-card">
                <div className="missing-doc-header">
                  <div>
                    <h4 className="missing-event-name">{item.event}</h4>
                    <p className="missing-club-name">{item.club}</p>
                  </div>
                  <span className="pending-count">{item.count} docs pending</span>
                </div>
                <div className="missing-doc-list">
                  {item.missing.map((doc, idx) => (
                    <span key={idx} className="missing-doc-badge">⚠️ {doc}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
