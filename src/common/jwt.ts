import elysisaJwt from "@elysiajs/jwt";

const jwt = elysisaJwt({
  name: "jwt",
  secret: Bun.env.JWT_SECRET || "demands",
  exp: "7d",
});

export default jwt;

export type JwtContext = Pick<typeof jwt.decorators, "jwt">;
