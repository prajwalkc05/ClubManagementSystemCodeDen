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

const getLogs = (req, res) => {
    // In a real app, you'd filter by query params here (req.query)
    // For now, we simulate a slight delay and return the mock data
    try {
        const { actionType } = req.query;
        let logs = [...mockLogs];

        if (actionType && actionType !== 'all') {
            logs = logs.filter(log => log.actionType === actionType);
        }

        // Simulate DB delay
        setTimeout(() => {
            res.status(200).json(logs);
        }, 100);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getLogs
};
