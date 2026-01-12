import { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';

const DocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [clubFilter, setClubFilter] = useState('All Clubs');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    documentService.getByEvent('all').then(res => setDocuments(res.data || [])).catch(() => {
      setDocuments([
        { id: 1, name: 'Event_Proposal.pdf', type: 'pdf', club: 'Tech Club', event: 'Tech Fest 2024', uploadDate: '2024-03-10', size: '2.3 MB', uploadedBy: 'John Doe', status: 'Uploaded', remarks: null },
        { id: 2, name: 'Budget_Report.xlsx', type: 'xlsx', club: 'Arts Club', event: 'Art Exhibition', uploadDate: '2024-03-12', size: '1.8 MB', uploadedBy: 'Jane Smith', status: 'Reviewed', remarks: null },
        { id: 3, name: 'Attendance_Sheet.xlsx', type: 'xlsx', club: 'Sports Club', event: 'Annual Tournament', uploadDate: '2024-03-15', size: '0.5 MB', uploadedBy: 'Mike Johnson', status: 'Approved', remarks: null },
        { id: 4, name: 'Event_Photos.zip', type: 'zip', club: 'Music Club', event: 'Spring Concert', uploadDate: '2024-03-18', size: '15.2 MB', uploadedBy: 'Sarah Williams', status: 'Uploaded', remarks: null },
        { id: 5, name: 'Final_Report.pdf', type: 'pdf', club: 'Tech Club', event: 'AI Workshop', uploadDate: '2024-03-20', size: '3.1 MB', uploadedBy: 'Tom Brown', status: 'Rejected', remarks: 'Please include detailed budget breakdown and participant feedback.' },
        { id: 6, name: 'Sponsorship_Letter.docx', type: 'docx', club: 'Arts Club', event: 'Cultural Fest', uploadDate: '2024-03-22', size: '0.8 MB', uploadedBy: 'Emily Davis', status: 'Approved', remarks: null }
      ]);
    });
  };

  const filteredDocs = documents.filter(doc => {
    const matchesClub = clubFilter === 'All Clubs' || doc.club === clubFilter;
    const matchesStatus = statusFilter === 'All Status' || doc.status === statusFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClub && matchesStatus && matchesSearch;
  });

  const getFileIcon = (type) => {
    const icons = { pdf: '📕', zip: '📦', xlsx: '📊', docx: '📘' };
    return icons[type] || '📄';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'approved',
      'Uploaded': 'uploaded',
      'Reviewed': 'reviewed',
      'Rejected': 'rejected'
    };
    return colors[status] || 'uploaded';
  };

  const handleApprove = () => {
    const updatedDocs = documents.map(d => d.id === selectedDoc.id ? { ...d, status: 'Approved', remarks: remark || null } : d);
    setDocuments(updatedDocs);
    setSelectedDoc(null);
    setRemark('');
  };

  const handleReject = () => {
    if (!remark.trim()) {
      alert('Please provide a remark for rejection');
      return;
    }
    const updatedDocs = documents.map(d => d.id === selectedDoc.id ? { ...d, status: 'Rejected', remarks: remark } : d);
    setDocuments(updatedDocs);
    setSelectedDoc(null);
    setRemark('');
  };

  const handleDownload = () => {
    alert(`Downloading ${selectedDoc.name}...`);
  };

  return (
    <div className="page-container">
      <div className="page-header-faculty">
        <div>
          <h1>Document Review & Tracking</h1>
          <p className="page-subtitle">Review and add remarks to uploaded documents</p>
        </div>
        <div className="faculty-controls">
          <select className="faculty-select" value={clubFilter} onChange={e => setClubFilter(e.target.value)}>
            <option>All Clubs</option>
            <option>Tech Club</option>
            <option>Arts Club</option>
            <option>Sports Club</option>
            <option>Music Club</option>
          </select>
          <select className="faculty-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Uploaded</option>
            <option>Reviewed</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <input 
            type="text" 
            className="faculty-search" 
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="empty-state-center">
          <div className="empty-icon">📄</div>
          <h3>No documents found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="document-list-faculty">
          {filteredDocs.map(doc => (
            <div key={doc.id}>
              <div className="document-card-horizontal" onClick={() => setSelectedDoc(doc)}>
                <div className="doc-icon-large">{getFileIcon(doc.type)}</div>
                <div className="doc-info-section">
                  <h3 className="doc-name-faculty">{doc.name}</h3>
                  <p className="doc-meta-faculty">{doc.club} • {doc.event}</p>
                  <div className="doc-details-row">
                    <span className="doc-detail-item">📅 {doc.uploadDate}</span>
                    <span className="doc-detail-item">💾 {doc.size}</span>
                    <span className="doc-detail-item">👤 {doc.uploadedBy}</span>
                  </div>
                </div>
                <span className={`status-badge-doc ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
              {doc.status === 'Rejected' && doc.remarks && (
                <div className="remark-box-readonly">
                  <strong>Faculty Remark:</strong> {doc.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedDoc && (
        <div className="modal-overlay-blur" onClick={() => { setSelectedDoc(null); setRemark(''); }}>
          <div className="document-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-doc">
              <h2>Document Details</h2>
              <button className="modal-close" onClick={() => { setSelectedDoc(null); setRemark(''); }}>×</button>
            </div>
            
            <div className="modal-body-doc">
              <div className="doc-preview-section">
                <div className="doc-icon-preview">{getFileIcon(selectedDoc.type)}</div>
                <h3>{selectedDoc.name}</h3>
                <p className="doc-event-info">{selectedDoc.club} • {selectedDoc.event}</p>
              </div>

              <div className="doc-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Uploaded By</span>
                  <span className="detail-value">{selectedDoc.uploadedBy}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Upload Date</span>
                  <span className="detail-value">{selectedDoc.uploadDate}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">File Size</span>
                  <span className="detail-value">{selectedDoc.size}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-${getStatusColor(selectedDoc.status)}`}>{selectedDoc.status}</span>
                </div>
              </div>

              <div className="remark-section">
                <label className="remark-label">Add Review Remark</label>
                <textarea 
                  className="remark-textarea"
                  placeholder="Enter your review remarks here..."
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  rows="5"
                />
              </div>
            </div>

            <div className="modal-actions-doc">
              <button className="btn-download" onClick={handleDownload}>
                ⬇️ Download
              </button>
              <button className="btn-approve" onClick={handleApprove}>
                ✓ Approve
              </button>
              <button className="btn-reject" onClick={handleReject}>
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReview;
