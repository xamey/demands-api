import type { User } from "./users.schema";

export function formattedUser(user: User) {
  const { email, name, superUser } = user;
  return { email, name, superUser };
}
