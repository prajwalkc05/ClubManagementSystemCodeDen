let clubs = [
    { id: 1, name: 'CSI', description: 'Computer Society of India - Student Chapter', members: 45 },
    { id: 2, name: 'IEEE', description: 'Institute of Electrical and Electronics Engineers', members: 50 },
    { id: 3, name: 'CPF', description: 'Competitive Programming Forum', members: 30 },
    { id: 4, name: 'Automations', description: 'Automating Campus Life', members: 20 },
    { id: 5, name: 'Placement', description: 'Training and Placement Cell', members: 100 },
    { id: 6, name: 'Media', description: 'Campus Media and Reporting', members: 15 },
];

const getAllClubs = (req, res) => {
    res.json(clubs);
};

const getClubById = (req, res) => {
    const club = clubs.find(c => c.id === parseInt(req.params.id));
    if (club) res.json(club);
    else res.status(404).json({ message: 'Club not found' });
};

const createClub = (req, res) => {
    const newClub = {
        id: clubs.length + 1,
        ...req.body
    };
    clubs.push(newClub);
    res.status(201).json(newClub);
};

const updateClub = (req, res) => {
    const index = clubs.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        clubs[index] = { ...clubs[index], ...req.body };
        res.json(clubs[index]);
    } else {
        res.status(404).json({ message: 'Club not found' });
    }
};

const deleteClub = (req, res) => {
    clubs = clubs.filter(c => c.id !== parseInt(req.params.id));
    res.json({ message: 'Club deleted' });
};

module.exports = {
    getAllClubs,
    getClubById,
    createClub,
    updateClub,
    deleteClub
};
