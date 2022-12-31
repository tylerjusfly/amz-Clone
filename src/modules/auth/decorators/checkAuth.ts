import { Auth } from '../auth.entity';

export function isAdmin(user: Auth) {
  return user.roles.some((role) => role.name === 'admin');
}

export function isSeller(user: Auth) {
  return user.roles.some((role) => role.name === 'seller');
}

export function isOwnerOrAdmin(user: Auth, id: number) {
  return user.id === id || user.roles.some((role) => role.name === 'admin');
}

export function isOwner(user: Auth, id) {
  return user.id === id;
}
