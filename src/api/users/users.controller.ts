import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { checkAuth, notFound, unauthorized } from "../../common/utils";
import { userInsert } from "./users.schema";
import { UserService } from "./users.service";
import { formattedUser } from "./users.util";
import { randomBytes } from "crypto";

const usersController = new Elysia()
  .use(jwt)
  .post(
    "users/login",
    async ({ body, jwt }) => {
      const { email, password } = body.user;
      const user = await UserService.authenticate(email, password);
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
        .resolve(checkAuth)
        .post(
          "users",
          async ({ body, jwt, currentUser }) => {
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
        .get("user", async ({ token, currentUser }) => {
          if (!currentUser) {
            throw notFound();
          }
          return { user: { ...formattedUser(currentUser), token } };
        })
        .get("users", async ({ currentUser }) => {
          if (!currentUser?.superUser) {
            throw unauthorized();
          }
          const users = await UserService.findAllExcept(currentUser.id);
          return { users: users.map(formattedUser) };
        })
  );

export default usersController;
