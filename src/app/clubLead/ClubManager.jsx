import { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';

const ClubManager = () => {
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', academicYear: '2024-25', description: '', status: 'Active' });

  const loadClubs = () => {
    clubService.getAll().then(res => setClubs(res.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    clubService.create(formData).then(() => {
      loadClubs();
      setIsModalOpen(false);
      setFormData({ name: '', academicYear: '2024-25', description: '', status: 'Active' });
    }).catch(() => {});
  };

  const filteredClubs = filter === 'All' ? clubs : clubs.filter(c => c.status === filter);

  return (
    <div className="page-container">
      <div className="page-actions">
        <div className="filter-tabs">
          {['All', 'Active', 'Draft', 'Archived'].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Create New Club
        </button>
      </div>

      <div className="club-grid">
        {filteredClubs.length > 0 ? filteredClubs.map((club, idx) => (
          <div key={idx} className="club-card-modern">
            <div className="club-card-header">
              <div>
                <h3 className="club-name">{club.name}</h3>
                <span className="club-year">{club.academicYear || '2024-25'}</span>
              </div>
              <span className={`status-badge ${(club.status || 'Active').toLowerCase()}`}>
                {club.status || 'Active'}
              </span>
            </div>
            <p className="club-description">{club.description || 'No description'}</p>
            <div className="club-card-footer">
              <span className="club-date">Created: {club.createdAt || 'Jan 15, 2024'}</span>
              <div className="club-actions">
                <button className="icon-btn" title="Edit">✏️</button>
                <button className="icon-btn" title="Archive">📦</button>
                <button className="icon-btn" title="Lock">🔒</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="empty-state-large">No clubs found</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Club</h3>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modern">
              <div className="form-group">
                <label>Club Name</label>
                <input type="text" placeholder="Enter club name" value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input type="text" value={formData.academicYear}
                  onChange={e => setFormData({...formData, academicYear: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Enter description" value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Club</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManager;
