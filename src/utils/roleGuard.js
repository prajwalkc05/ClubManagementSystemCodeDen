export const ROLES = {
  FACULTY: 'FACULTY',
  CLUB_LEAD: 'CLUB_LEAD',
  INDIVIDUAL: 'INDIVIDUAL'
};

export const getRoleRoute = (role) => {
  switch (role) {
    case ROLES.FACULTY: return '/faculty';
    case ROLES.CLUB_LEAD: return '/club-lead';
    case ROLES.INDIVIDUAL: return '/individual';
    default: return '/login';
  }
};

export const hasAccess = (userRole, allowedRoles) => allowedRoles.includes(userRole);
