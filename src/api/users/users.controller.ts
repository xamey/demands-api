import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { getAuthUserId, notFound, unauthorized } from "../../common/utils";
import { userInsert } from "./users.schema";
import { UserService } from "./users.service";
import { formattedUser } from "./users.util";
import { randomBytes } from "crypto";
import { elylog, LogType } from "@eajr/elylog";

const usersController = new Elysia()
  .use(jwt)
  .use(elylog())
  .post(
    "users/login",
    async ({ body, jwt, log }) => {
      const { email, password } = body.user;
      const user = await UserService.authenticate(email, password, log);
      const token = await jwt.sign({ id: user.id });
      return { user: { ...formattedUser(user), token } };
    },
    {
      body: t.Object({ user: t.Pick(userInsert, ["email", "password"]) }),
    }
  )
  .guard(
    {
      headers: t.Object({
        authorization: t.TemplateLiteral("Bearer ${string}"),
      }),
    },
    (app) =>
      app
        .resolve(getAuthUserId)
        .use(elylog())
        .post(
          "users",
          async ({ body, userId, jwt }) => {
            const currentUser = UserService.find(userId);
            if (!currentUser?.superUser) {
              throw unauthorized();
            }
            const [user] = await UserService.create({
              ...body.user,
              password: Bun.password.hashSync(randomBytes(32)),
            });

            const token = await jwt.sign({ id: user.id });
            return { user: { ...formattedUser(user), token } };
          },
          {
            body: t.Object({
              user: t.Pick(userInsert, ["email", "name"]),
            }),
          }
        )
        .get("user", async ({ userId, token, log }) => {
          log(LogType.INFO, { message: `coucou userId: ${token}` });
          const user = UserService.find(userId);
          if (!user) {
            throw notFound();
          }
          return { user: { ...formattedUser(user!), token } };
        })
        .get("users", async ({ userId }) => {
          const currentUser = UserService.find(userId);
          if (!currentUser?.superUser) {
            throw unauthorized();
          }
          const users = await UserService.findAllExcept(userId);
          return { users: users.map(formattedUser) };
        })
  );

export default usersController;
