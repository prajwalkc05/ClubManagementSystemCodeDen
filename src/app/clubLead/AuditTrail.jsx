import { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats] = useState({ docsUploaded: 45, completedEvents: 12, auditCoverage: 87 });
  const itemsPerPage = 10;

  const mockLogs = [
    { id: 1, timestamp: 'Jan 9, 2026, 08:14 PM', user: 'Club Lead', userRole: 'Club Lead', action: 'Club Created', actionType: 'club_created', entity: 'Tech Innovation Club', details: 'Created new club with 25 members', avatar: '👤' },
    { id: 2, timestamp: 'Jan 9, 2026, 07:45 PM', user: 'Club Lead', userRole: 'Club Lead', action: 'Schedule Created', actionType: 'schedule_created', entity: 'Hackathon 2026', details: 'Scheduled event for March 15, 2026', avatar: '👤' },
    { id: 3, timestamp: 'Jan 9, 2026, 06:30 PM', user: 'Club Lead', userRole: 'Club Lead', action: 'Document Uploaded', actionType: 'document_uploaded', entity: 'Budget_Sheet.pdf', details: 'Uploaded Budget_Sheet.pdf', avatar: '👤' },
    { id: 4, timestamp: 'Jan 9, 2026, 05:20 PM', user: 'Faculty', userRole: 'Faculty', action: 'Document Reviewed', actionType: 'document_reviewed', entity: 'Event_Proposal.pdf', details: 'Reviewed and approved document', avatar: '👨‍🏫' },
    { id: 5, timestamp: 'Jan 8, 2026, 04:15 PM', user: 'Club Lead', userRole: 'Club Lead', action: 'Document Updated', actionType: 'document_updated', entity: 'Annual_Report.pdf', details: 'Updated annual report with new data', avatar: '👤' },
    { id: 6, timestamp: 'Jan 8, 2026, 02:10 PM', user: 'Faculty', userRole: 'Faculty', action: 'Document Rejected', actionType: 'document_rejected', entity: 'Incomplete_Form.pdf', details: 'Rejected due to missing information', avatar: '👨‍🏫' },
    { id: 7, timestamp: 'Jan 8, 2026, 11:30 AM', user: 'Club Lead', userRole: 'Club Lead', action: 'Schedule Created', actionType: 'schedule_created', entity: 'Workshop Series', details: 'Created monthly workshop schedule', avatar: '👤' },
    { id: 8, timestamp: 'Jan 7, 2026, 09:00 AM', user: 'Club Lead', userRole: 'Club Lead', action: 'Document Uploaded', actionType: 'document_uploaded', entity: 'Member_List.xlsx', details: 'Uploaded updated member list', avatar: '👤' },
  ];

  useEffect(() => {
    auditService.getLogs({}).then(res => {
      setLogs(res.data || mockLogs);
      setFilteredLogs(res.data || mockLogs);
    }).catch(() => {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
    });
  }, []);

  useEffect(() => {
    let filtered = [...logs];
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.actionType === actionFilter);
    }
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [actionFilter, logs]);

  const getActionBadgeClass = (actionType) => {
    const classes = {
      club_created: 'badge-green',
      schedule_created: 'badge-green',
      document_uploaded: 'badge-purple',
      document_reviewed: 'badge-blue',
      document_updated: 'badge-purple',
      document_rejected: 'badge-red'
    };
    return classes[actionType] || 'badge-gray';
  };

  const handleExportCSV = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Details'],
      ...filteredLogs.map(log => [log.timestamp, log.user, log.action, log.entity, log.details])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportExcel = () => {
    alert('Excel export functionality - would integrate with xlsx library');
  };

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div>
          <h1 className="audit-title">System Audit Log</h1>
          <p className="audit-subtitle">Complete trail of all actions for compliance & accountability</p>
        </div>
        <div className="audit-controls">
          <select className="audit-filter" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option value="all">All Actions</option>
            <option value="club_created">Club Created</option>
            <option value="schedule_created">Schedule Created</option>
            <option value="document_uploaded">Document Uploaded</option>
            <option value="document_updated">Document Updated</option>
            <option value="document_reviewed">Document Reviewed</option>
            <option value="document_rejected">Document Rejected</option>
          </select>
          <button className="export-btn" onClick={handleExportCSV}>Export to CSV</button>
          <button className="export-btn" onClick={handleExportExcel}>Export to Excel</button>
        </div>
      </div>

      <div className="audit-table-wrapper">
        <table className="audit-log-table">
          <thead>
            <tr>
              <th>🕐 Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map(log => (
              <tr key={log.id}>
                <td className="timestamp-col">{log.timestamp}</td>
                <td>
                  <div className="user-info">
                    <span className="user-avatar">{log.avatar}</span>
                    <div>
                      <div className="user-name">{log.user}</div>
                      <div className="user-role">{log.userRole}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`action-badge ${getActionBadgeClass(log.actionType)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="entity-col">{log.entity}</td>
                <td className="details-col">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="audit-footer">
        <div className="entry-count">Showing {paginatedLogs.length} entries</div>
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}>
            Previous
          </button>
          <button 
            className="page-btn" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">{stats.docsUploaded}</div>
            <div className="summary-label">Documents Uploaded</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📅</div>
          <div className="summary-content">
            <div className="summary-value">{stats.completedEvents}</div>
            <div className="summary-label">Completed Events</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🛡️</div>
          <div className="summary-content">
            <div className="summary-value">{stats.auditCoverage}%</div>
            <div className="summary-label">Audit Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
