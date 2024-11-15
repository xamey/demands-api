import { dayoffs, users } from "./schema";
import db from "./connection";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

const main = async () => {
  await db.delete(users);
  await db.insert(users).values([
    {
      name: "Admin",
      email: "admin@test.com",
      password: Bun.password.hashSync("test"),
      superUser: true,
    },
    {
      name: "Test1",
      email: "test1@test.com",
      password: Bun.password.hashSync("test"),
      superUser: false,
    },
    {
      name: "Test2",
      email: "test2@test.com",
      password: Bun.password.hashSync("test"),
      superUser: false,
    },
  ]);

  const test1 = (
    await db.select().from(users).where(eq(users.email, "test1@test.com"))
  )[0];

  const test2 = (
    await db.select().from(users).where(eq(users.email, "test2@test.com"))
  )[0];

  await db.insert(dayoffs).values([
    {
      userId: test1.id,
      date: dayjs().toISOString(),
      status: "pending",
    },
    {
      userId: test1.id,
      date: dayjs().subtract(1, "day").toISOString(),
      status: "approved",
    },
    {
      userId: test2.id,
      date: dayjs().toISOString(),
      status: "pending",
    },
  ]);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
