import { NavLink } from './types';

export const navs: NavLink[] = [
  { name: 'Sign Up', path: '/signup' },
  { name: 'Login', path: '/api/auth/signin' },
];

export const loggedInNavs: NavLink[] = [
  { name: 'Trips', path: '/trips' },
  { name: 'Sign Out', path: '/api/auth/signout' },
];
