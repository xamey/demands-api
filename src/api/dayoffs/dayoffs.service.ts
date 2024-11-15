import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { dayoffs } from "../../db/schema";
import { DayOffInsert } from "./dayoffs.schema";
import { unprocessable } from "../../common/utils";

export abstract class DayOffsService {
  static async collect(userId: number) {
    return db.query.dayoffs.findMany({
      where: eq(dayoffs.userId, userId),
    });
  }

  static async create(userId: number, body: DayOffInsert) {
    try {
      const dayOff = await db
        .insert(dayoffs)
        .values({ ...body, userId })
        .returning();
      return dayOff;
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static async find(id: number) {
    const [dayOff] = await db
      .select()
      .from(dayoffs)
      .where(eq(dayoffs.id, id))
      .limit(1);

    return dayOff;
  }

  static async delete(id: number) {
    try {
      return db.delete(dayoffs).where(eq(dayoffs.id, id));
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static async modifyStatus(id: number, status: "approved" | "refused") {
    try {
      return db.update(dayoffs).set({ status }).where(eq(dayoffs.id, id));
    } catch (e) {
      throw unprocessable(e);
    }
  }
}
