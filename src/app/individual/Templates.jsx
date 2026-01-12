import { useState, useEffect } from 'react';
import { templateService } from '../../services/templateService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    templateService.getAll().then(res => {
      setTemplates(res.data || []);
    }).catch(() => {
      setTemplates([
        { id: 1, name: 'Event Proposal Template.docx', type: 'Word', uploadDate: '2024-03-01', size: '45 KB', description: 'Standard event proposal format' },
        { id: 2, name: 'Budget Format.pdf', type: 'PDF', uploadDate: '2024-03-01', size: '120 KB', description: 'Budget planning template' },
        { id: 3, name: 'Attendance Sheet.xlsx', type: 'Excel', uploadDate: '2024-03-05', size: '30 KB', description: 'Event attendance tracker' }
      ]);
    });
  };

  const handleDownload = (template) => {
    alert(`Downloading: ${template.name}\n\nThis template will help you prepare your documents.`);
  };

  return (
    <div className="page-container">
      <div className="template-header">
        <div>
          <h2>📝 Document Templates</h2>
          <p>Download templates to prepare your event documents</p>
        </div>
      </div>

      <div className="template-grid">
        {templates.length > 0 ? templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-icon">
              {template.type === 'PDF' && '📕'}
              {template.type === 'Word' && '📘'}
              {template.type === 'Excel' && '📊'}
            </div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p className="template-description">{template.description}</p>
              <div className="template-meta">
                <span>{template.type}</span>
                <span>{template.size}</span>
              </div>
            </div>
            <button className="btn-download" onClick={() => handleDownload(template)}>
              ⬇️ Download Template
            </button>
          </div>
        )) : (
          <div className="empty-state-large">
            <div className="empty-icon">📝</div>
            <h3>No templates available</h3>
            <p>Templates will appear here once uploaded by club leads</p>
          </div>
        )}
      </div>

      <div className="template-help">
        <h4>💡 How to Use Templates</h4>
        <ol>
          <li>Download the required template</li>
          <li>Fill in your event details</li>
          <li>Upload the completed document in the Checklist section</li>
        </ol>
      </div>
    </div>
  );
};

export default Templates;
