import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES } from './utils/roleGuard';
import Login from './pages/Login';
import Register from './pages/Register';

import FacultyLayout from './layouts/FacultyLayout';
import FacultyDashboard from './app/faculty/Dashboard';
import ClubOverview from './app/faculty/ClubOverview';
import ScheduleMonitor from './app/faculty/ScheduleMonitor';
import DocumentReview from './app/faculty/DocumentReview';
import AuditLogs from './app/faculty/AuditLogs';
import FacultyCommunication from './app/faculty/Communication';
import EventCompletion from './app/faculty/EventCompletion';

import ClubLeadLayout from './layouts/ClubLeadLayout';
import ClubLeadDashboard from './app/clubLead/Dashboard';
import ClubManager from './app/clubLead/ClubManager';
import ScheduleManager from './app/clubLead/ScheduleManager';
import ChecklistManager from './app/clubLead/ChecklistManager';
import Communication from './app/clubLead/Communication';
import AuditTrail from './app/clubLead/AuditTrail';
import NAACDocuments from './app/clubLead/NAACDocuments';
import ClubLeadTemplates from './app/clubLead/Templates';

import IndividualLayout from './layouts/IndividualLayout';
import IndividualDashboard from './app/individual/Dashboard';
import EventSchedules from './app/individual/EventSchedules';
import ChecklistUpload from './app/individual/ChecklistUpload';
import Messages from './app/individual/Messages';
import IndividualTemplates from './app/individual/Templates';
import IndividualProfile from './app/individual/Profile';
import ClubLeadProfile from './app/clubLead/Profile';
import FacultyProfile from './app/faculty/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/faculty" element={<ProtectedRoute allowedRoles={[ROLES.FACULTY]}><FacultyLayout /></ProtectedRoute>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="clubs" element={<ClubOverview />} />
          <Route path="schedules" element={<ScheduleMonitor />} />
          <Route path="documents" element={<DocumentReview />} />
          <Route path="completion" element={<EventCompletion />} />
          <Route path="communication" element={<FacultyCommunication />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="profile" element={<FacultyProfile />} />
        </Route>

        <Route path="/club-lead" element={<ProtectedRoute allowedRoles={[ROLES.CLUB_LEAD]}><ClubLeadLayout /></ProtectedRoute>}>
          <Route index element={<ClubLeadDashboard />} />
          <Route path="clubs" element={<ClubManager />} />
          <Route path="schedules" element={<ScheduleManager />} />
          <Route path="checklists" element={<ChecklistManager />} />
          <Route path="communication" element={<Communication />} />
          <Route path="naac" element={<NAACDocuments />} />
          <Route path="templates" element={<ClubLeadTemplates />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="profile" element={<ClubLeadProfile />} />
        </Route>

        <Route path="/individual" element={<ProtectedRoute allowedRoles={[ROLES.INDIVIDUAL]}><IndividualLayout /></ProtectedRoute>}>
          <Route index element={<IndividualDashboard />} />
          <Route path="schedules" element={<EventSchedules />} />
          <Route path="uploads" element={<ChecklistUpload />} />
          <Route path="templates" element={<IndividualTemplates />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<IndividualProfile />} />
        </Route>

        <Route path="/unauthorized" element={<div className="page"><h1>Unauthorized Access</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
