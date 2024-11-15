import { users } from "./schema";
import db from "./connection";

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
