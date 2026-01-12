import { useState } from 'react';

const FacultyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('facultyProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Dr. Smith',
      email: 'dr.smith@example.com',
      phone: '+1 234 567 8900',
      department: 'Computer Science',
      qualification: 'Ph.D. in Computer Science',
      experience: '15years'
    };
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    localStorage.setItem('facultyProfile', JSON.stringify(editedProfile));
    setIsEditing(false);
    alert('Profile updated successfully!');
    window.location.reload();
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1 className="profile-title">👤 My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>
        <div className="live-datetime">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <h2 className="profile-name-display">{profile.name}</h2>
          <p className="profile-role-display">Faculty Advisor</p>
        </div>

        <div className="profile-details-section">
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
              {!isEditing ? (
                <button className="edit-profile-btn" onClick={handleEdit}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>✓ Save</button>
                  <button className="cancel-btn" onClick={handleCancel}>✕ Cancel</button>
                </div>
              )}
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.name} onChange={e => handleChange('name', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.name}</div>
                )}
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input type="email" value={editedProfile.email} onChange={e => handleChange('email', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.email}</div>
                )}
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input type="tel" value={editedProfile.phone} onChange={e => handleChange('phone', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.phone}</div>
                )}
              </div>

              <div className="profile-field">
                <label>Department</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.department} onChange={e => handleChange('department', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.department}</div>
                )}
              </div>

              <div className="profile-field">
                <label>Qualification</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.qualification} onChange={e => handleChange('qualification', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.qualification}</div>
                )}
              </div>

              <div className="profile-field">
                <label>Experience</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.experience} onChange={e => handleChange('experience', e.target.value)} />
                ) : (
                  <div className="field-value">{profile.experience}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
