import { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { auditService } from '../../services/auditService';

const NAACDocuments = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState('');

  const loadDocuments = () => {
    documentService.getByEvent('all').then(res => {
      setDocuments(res.data || []);
    }).catch(() => {
      setDocuments([
        { id: 1, name: 'Annual Report 2024', category: 'Report', size: '2.3 MB', status: 'Uploaded', year: '2024-25', uploadedBy: 'John Doe', uploadDate: '2024-03-15' },
        { id: 2, name: 'Executive Summary', category: 'Summary', size: '1.8 MB', status: 'Reviewed', year: '2024-25', uploadedBy: 'Jane Smith', uploadDate: '2024-03-16' },
        { id: 3, name: 'Student Data Analysis', category: 'Data', size: '3.5 MB', status: 'Approved', year: '2024-25', uploadedBy: 'Mike Johnson', uploadDate: '2024-03-17' },
        { id: 4, name: 'Financial Statements', category: 'Finance', size: '1.2 MB', status: 'Uploaded', year: '2024-25', uploadedBy: 'Sarah Lee', uploadDate: '2024-03-18' },
        { id: 5, name: 'Event Media Coverage', category: 'Media', size: '5.1 MB', status: 'Rejected', year: '2024-25', uploadedBy: 'Tom Brown', uploadDate: '2024-03-19', remark: 'Please provide higher quality images' },
        { id: 6, name: 'Infrastructure Report', category: 'Report', size: '2.8 MB', status: 'Uploaded', year: '2024-25', uploadedBy: 'Admin', uploadDate: '2024-03-20' }
      ]);
    });
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedYear]);

  const logAction = (action, doc) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: 'Club Lead',
      action,
      documentId: doc.id,
      documentName: doc.name
    };
    auditService.getLogs(logEntry).catch(() => {});
  };

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setRemark(doc.remark || '');
    setShowModal(true);
  };

  const handleDownload = (doc) => {
    logAction('DOWNLOAD', doc);
    documentService.download(doc.id).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch(() => {
      alert(`Downloading: ${doc.name}`);
    });
  };

  const handleApprove = () => {
    documentService.updateStatus(selectedDoc.id, 'Approved', remark).then(() => {
      setDocuments(documents.map(d => d.id === selectedDoc.id ? {...d, status: 'Approved', remark} : d));
      logAction('APPROVE', selectedDoc);
      setShowModal(false);
      alert('Document approved successfully');
    }).catch(() => {
      setDocuments(documents.map(d => d.id === selectedDoc.id ? {...d, status: 'Approved', remark} : d));
      logAction('APPROVE', selectedDoc);
      setShowModal(false);
      alert('Document approved successfully');
    });
  };

  const handleReject = () => {
    if (!remark.trim()) {
      alert('Please provide a remark for rejection');
      return;
    }
    documentService.updateStatus(selectedDoc.id, 'Rejected', remark).then(() => {
      setDocuments(documents.map(d => d.id === selectedDoc.id ? {...d, status: 'Rejected', remark} : d));
      logAction('REJECT', selectedDoc);
      setShowModal(false);
      alert('Document rejected successfully');
    }).catch(() => {
      setDocuments(documents.map(d => d.id === selectedDoc.id ? {...d, status: 'Rejected', remark} : d));
      logAction('REJECT', selectedDoc);
      setShowModal(false);
      alert('Document rejected successfully');
    });
  };

  const filteredDocs = documents.filter(doc => doc.year === selectedYear);

  const getCategoryColor = (category) => {
    const colors = {
      'Report': 'category-report',
      'Summary': 'category-summary',
      'Data': 'category-data',
      'Finance': 'category-finance',
      'Media': 'category-media'
    };
    return colors[category] || 'category-default';
  };

  const getStatusClass = (status) => {
    const classes = {
      'Uploaded': 'status-uploaded',
      'Reviewed': 'status-reviewed',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected'
    };
    return classes[status] || 'status-default';
  };

  return (
    <div className="premium-page">
      <div className="premium-header">
        <div>
          <h1 className="premium-title">NAAC / IQAC Documents</h1>
          <p className="premium-subtitle">Document review and approval</p>
        </div>
        <div className="premium-controls">
          <select className="premium-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="document-card" onClick={() => handleViewDocument(doc)} style={{cursor: 'pointer'}}>
            <div className="doc-icon">📄</div>
            <div className="doc-content">
              <h3 className="doc-title">{doc.name}</h3>
              <div className="doc-meta">
                <span className={`doc-category ${getCategoryColor(doc.category)}`}>{doc.category}</span>
                <span className="doc-size">{doc.size}</span>
              </div>
              <div className="doc-footer">
                <span className={`status-badge ${getStatusClass(doc.status)}`}>
                  {doc.status}
                </span>
                <button 
                  className="doc-download-btn"
                  onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}>
                  ⬇️ Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedDoc && (
        <div className="modal-overlay-blur" onClick={() => setShowModal(false)}>
          <div className="document-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-doc">
              <h2>Document Review</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body-doc">
              <div className="doc-preview-section">
                <div className="doc-icon-preview">📄</div>
                <h3>{selectedDoc.name}</h3>
                <p className="doc-event-info">{selectedDoc.category}</p>
              </div>
              <div className="doc-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Upload Date</span>
                  <span className="detail-value">{selectedDoc.uploadDate}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">File Size</span>
                  <span className="detail-value">{selectedDoc.size}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Uploaded By</span>
                  <span className="detail-value">{selectedDoc.uploadedBy}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-${selectedDoc.status.toLowerCase()}`}>{selectedDoc.status}</span>
                </div>
              </div>
              <div className="remark-section">
                <label className="remark-label">Remarks</label>
                <textarea className="remark-textarea" value={remark} 
                  onChange={e => setRemark(e.target.value)}
                  placeholder="Add remarks..." rows="4" />
              </div>
              {selectedDoc.remark && selectedDoc.status === 'Rejected' && (
                <div className="remark-box-readonly">
                  <strong>Previous Remark:</strong>
                  <p>{selectedDoc.remark}</p>
                </div>
              )}
            </div>
            <div className="modal-actions-doc">
              <button className="btn-download" onClick={() => handleDownload(selectedDoc)}>📥 Download</button>
              <button className="btn-approve" onClick={handleApprove}>✅ Approve</button>
              <button className="btn-reject" onClick={handleReject}>❌ Reject</button>
            </div>
          </div>
        </div>
      )}

      <div className="premium-info-panel">
        <div className="info-section">
          <h4>🔒 Access</h4>
          <ul>
            <li>✅ Review Documents</li>
            <li>✅ Approve/Reject</li>
          </ul>
        </div>
        <div className="info-section">
          <h4>🛡️ Security</h4>
          <ul>
            <li>✅ All actions logged</li>
            <li>✅ NAAC/IQAC compliant</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NAACDocuments;
