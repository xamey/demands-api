import type { User } from "./users.schema";

export function formattedUser(user: User) {
  const { id, email, name, superUser } = user;
  return { id, email, name, superUser };
}
