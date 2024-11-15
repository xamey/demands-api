import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { dayoffs } from "../../db/schema";
import type { Static } from "elysia";

export const dayOffInsert = createInsertSchema(dayoffs);
export const dayOffSelect = createSelectSchema(dayoffs);

export type DayOffInsert = Static<typeof dayOffInsert>;
export type DayOff = Static<typeof dayOffSelect>;
