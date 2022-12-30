import { Auth } from '../auth.entity';

export function isAdmin(user: Auth) {
  return user.roles.some((role) => role.name === 'admin');
}

export function isSeller(user: Auth) {
  return user.roles.some((role) => role.name === 'seller');
}

export function isOwnerOrAdmin(user: Auth, product) {
  return user.id === product.userId || user.roles.some((role) => role.name === 'admin');
}

export function isOwner(user: Auth, id) {
  return user.id === id;
}
