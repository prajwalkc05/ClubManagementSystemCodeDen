import { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';

const ClubOverview = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = () => {
    clubService.getAll().then(res => setClubs(res.data || [])).catch(() => {
      setClubs([
        { id: 1, name: 'Tech Club', icon: '💻', academicYear: '2024-25', status: 'Active', totalEvents: 12, completed: 10, pending: 2, lead: 'John Doe' },
        { id: 2, name: 'Arts Club', icon: '🎨', academicYear: '2024-25', status: 'Active', totalEvents: 8, completed: 7, pending: 1, lead: 'Jane Smith' },
        { id: 3, name: 'Sports Club', icon: '⚽', academicYear: '2024-25', status: 'Active', totalEvents: 10, completed: 8, pending: 2, lead: 'Mike Johnson' },
        { id: 4, name: 'Music Club', icon: '🎵', academicYear: '2024-25', status: 'Active', totalEvents: 6, completed: 5, pending: 1, lead: 'Sarah Williams' },
        { id: 5, name: 'Drama Club', icon: '🎭', academicYear: '2023-24', status: 'Archived', totalEvents: 15, completed: 15, pending: 0, lead: 'Tom Brown' },
        { id: 6, name: 'Photography Club', icon: '📷', academicYear: '2023-24', status: 'Archived', totalEvents: 10, completed: 10, pending: 0, lead: 'Lisa Davis' }
      ]);
    });
  };

  const filteredClubs = clubs.filter(club => {
    const matchesYear = club.academicYear === selectedYear;
    const matchesStatus = statusFilter === 'All Status' || club.status === statusFilter;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesStatus && matchesSearch;
  });

  const handleView = (club) => {
    if (club.status === 'Archived') return;
    alert(`Viewing ${club.name}\n\nThis is a read-only view for faculty monitoring.`);
  };

  return (
    <div className="page-container">
      <div className="page-header-faculty">
        <div>
          <h1>Club Overview</h1>
          <p className="page-subtitle">Monitor all clubs across academic years</p>
        </div>
        <div className="faculty-controls">
          <select className="faculty-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
          <select className="faculty-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
          <input 
            type="text" 
            className="faculty-search" 
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="faculty-table-container">
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Academic Year</th>
              <th>Status</th>
              <th>Total Events</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map(club => (
              <tr key={club.id} className={club.status === 'Archived' ? 'archived-row' : ''}>
                <td>
                  <div className="club-name-cell">
                    <div className="club-icon">{club.icon}</div>
                    <span>{club.name}</span>
                  </div>
                </td>
                <td>{club.academicYear}</td>
                <td>
                  <span className={`status-badge-table ${club.status.toLowerCase()}`}>
                    {club.status}
                  </span>
                </td>
                <td>{club.totalEvents}</td>
                <td><span className="count-green">{club.completed}</span></td>
                <td><span className="count-orange">{club.pending}</span></td>
                <td>
                  <div className="action-icons">
                    <button 
                      className={`action-icon ${club.status === 'Archived' ? 'disabled' : ''}`}
                      onClick={() => handleView(club)}
                      disabled={club.status === 'Archived'}
                      title={club.status === 'Archived' ? 'Archived clubs are read-only' : 'View club'}>
                      👁️
                    </button>
                    {club.status === 'Archived' && (
                      <span className="action-icon disabled" title="Archived and locked">🔒</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubOverview;
