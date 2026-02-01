const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
    // General Secretary
    { id: 2, name: 'General Secretary', email: 'gsec@college.edu', password: 'password', role: 'general_secretary' },
    // Faculty
    { id: 3, name: 'Faculty Coordinator', email: 'faculty@college.edu', password: 'password', role: 'faculty' },
    // Club Leads
    { id: 4, name: 'CSI Lead', email: 'csi@college.edu', password: 'password', role: 'club_lead', club: 'CSI' },
    { id: 5, name: 'IEEE Lead', email: 'ieee@college.edu', password: 'password', role: 'club_lead', club: 'IEEE' },
    { id: 6, name: 'CPF Lead', email: 'cpf@college.edu', password: 'password', role: 'club_lead', club: 'CPF' },
    { id: 7, name: 'Automations Lead', email: 'automations@college.edu', password: 'password', role: 'club_lead', club: 'Automations' },
    { id: 8, name: 'Placement Lead', email: 'placement@college.edu', password: 'password', role: 'club_lead', club: 'Placement' },
    { id: 9, name: 'Media Lead', email: 'media@college.edu', password: 'password', role: 'club_lead', club: 'Media' },
];

const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({
            token: 'mock-jwt-token-' + user.id,
            role: user.role,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const register = (req, res) => {
    const { name, email, password, role } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: role || 'student'
    };

    users.push(newUser);

    res.status(201).json({
        token: 'mock-jwt-token-' + newUser.id,
        role: newUser.role,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
};

module.exports = { login, register };
