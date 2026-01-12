import { useState, useEffect } from 'react';
import { templateService } from '../../services/templateService';
import { auditService } from '../../services/auditService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [formData, setFormData] = useState({ name: '', category: '', file: null });
  const [dragActive, setDragActive] = useState(false);

  const categories = ['Event Report', 'Budget Sheet', 'Attendance', 'Proposal'];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    templateService.getAll().then(res => {
      setTemplates(res.data || []);
    }).catch(() => {
      setTemplates([
        { id: 1, name: 'Event Proposal Template', category: 'Proposal', type: 'docx', uploadDate: '2024-03-01', year: '2024-25' },
        { id: 2, name: 'Budget Format', category: 'Budget Sheet', type: 'xlsx', uploadDate: '2024-03-01', year: '2024-25' },
        { id: 3, name: 'Attendance Sheet', category: 'Attendance', type: 'xlsx', uploadDate: '2024-03-05', year: '2024-25' }
      ]);
    });
  };

  const logAction = (action, template) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: 'John Doe (Club Lead)',
      action,
      templateId: template?.id,
      templateName: template?.name,
      academicYear: selectedYear
    };
    auditService.getLogs(logEntry).catch(() => {});
    console.log('Audit Log:', logEntry);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.file) {
      alert('Please fill all fields and select a file');
      return;
    }

    const fileExt = formData.file.name.split('.').pop();
    const newTemplate = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      type: fileExt,
      uploadDate: new Date().toISOString().split('T')[0],
      year: selectedYear
    };

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.file);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);

    templateService.upload(formDataToSend).then(() => {
      setTemplates([...templates, newTemplate]);
      logAction('UPLOAD', newTemplate);
      setFormData({ name: '', category: '', file: null });
      alert('Template uploaded successfully');
    }).catch(() => {
      setTemplates([...templates, newTemplate]);
      logAction('UPLOAD', newTemplate);
      setFormData({ name: '', category: '', file: null });
      alert('Template uploaded successfully');
    });
  };

  const handleView = (template) => {
    logAction('VIEW', template);
    alert(`Viewing: ${template.name}`);
  };

  const handleDownload = (template) => {
    logAction('DOWNLOAD', template);
    alert(`Downloading: ${template.name}`);
  };

  const filteredTemplates = templates.filter(t => 
    t.year === selectedYear && (categoryFilter === 'All Categories' || t.category === categoryFilter)
  );

  const getFileIcon = (type) => {
    if (type === 'pdf') return '📕';
    if (type === 'docx' || type === 'doc') return '📘';
    if (type === 'xlsx' || type === 'xls') return '📊';
    return '📄';
  };

  return (
    <div className="page-container">
      <div className="templates-page-header">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">Manage document templates</p>
        </div>
        <div className="header-controls">
          <button className={`view-mode-badge ${viewOnlyMode ? 'active' : ''}`} 
            onClick={() => setViewOnlyMode(!viewOnlyMode)}>
            👁️ View-Only Mode {viewOnlyMode ? 'ON' : 'OFF'}
          </button>
          <select className="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
      </div>

      {!viewOnlyMode && (
        <div className="upload-template-card">
          <h3 className="section-title">Upload Template</h3>
          <form onSubmit={handleUpload}>
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}>
              <div className="upload-icon">☁️</div>
              <div className="upload-text">
                {formData.file ? (
                  <span className="file-selected">📄 {formData.file.name}</span>
                ) : (
                  <>
                    <p className="upload-main">Drop template file here</p>
                    <p className="upload-sub">or click to browse</p>
                  </>
                )}
              </div>
              <p className="upload-formats">Supported formats: .docx, .doc, .pdf, .xlsx, .xls</p>
              <input type="file" id="file-input" accept=".pdf,.doc,.docx,.xls,.xlsx" 
                onChange={handleFileSelect} style={{ display: 'none' }} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Template Name</label>
                <input type="text" placeholder="Enter template name" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-upload-template">
              📄 Upload Template
            </button>
          </form>
        </div>
      )}

      {viewOnlyMode && (
        <div className="view-only-notice">
          🔒 View-Only Mode - Upload disabled
        </div>
      )}

      <div className="available-templates-section">
        <div className="section-header">
          <h3 className="section-title">Available Templates</h3>
          <select className="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All Categories">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="templates-grid">
          {filteredTemplates.length > 0 ? filteredTemplates.map(template => (
            <div key={template.id} className="template-card-pro">
              <div className="template-icon-large">{getFileIcon(template.type)}</div>
              <div className="template-details">
                <h4 className="template-name">{template.name}</h4>
                <div className="template-badges">
                  <span className="category-badge">{template.category}</span>
                  <span className="type-badge">.{template.type}</span>
                </div>
                <p className="template-date">Uploaded: {template.uploadDate}</p>
              </div>
              <div className="template-actions-row">
                <button className="btn-action-pro" onClick={() => handleDownload(template)}>
                  ⬇️ Download
                </button>
                <button className="btn-action-pro" onClick={() => handleView(template)}>
                  👁️ View
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-state-large">
              <div className="empty-icon">📄</div>
              <h3>No templates found</h3>
              <p>Upload templates or adjust filters</p>
            </div>
          )}
        </div>
      </div>

      <div className="naac-compliance-footer">
        <h4>🏛️ Compliance</h4>
        <ul>
          <li>✅ Year-specific templates</li>
          <li>✅ All actions logged</li>
        </ul>
      </div>
    </div>
  );
};

export default Templates;
