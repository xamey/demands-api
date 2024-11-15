import { eq, not } from "drizzle-orm";
import { unauthorized, unprocessable } from "../../common/utils";
import db from "../../db/connection";
import { users } from "../../db/schema";
import type { UserInsert } from "./users.schema";
import { ILoggerFn, LogType } from "@eajr/elylog";

export abstract class UserService {
  static async create(body: UserInsert) {
    body.password = await Bun.password.hash(body.password as string);
    try {
      const res = await db.insert(users).values(body).returning();
      return res;
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static async authenticate(email: string, password: string, log: ILoggerFn) {
    const user = (
      await db.select().from(users).where(eq(users.email, email)).limit(1)
    )[0];

    if (!user) throw unauthorized();

    if (!user) throw unauthorized();

    const isMatch = Bun.password.verifySync(password, user.password);

    if (!isMatch) throw unauthorized();

    return user;
  }

  static find(id: number) {
    return db.select().from(users).where(eq(users.id, id)).limit(1)[0];
  }

  static update(id: number, data: Partial<UserInsert>) {
    try {
      return db.update(users).set(data).where(eq(users.id, id)).run();
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static findAllExcept(id: number) {
    return db.query.users.findMany({
      where: not(eq(users.id, id)),
    });
  }
}
