import { error, type Context } from "elysia";
import { UserService } from "../api/users/users.service";
import { JwtContext } from "./jwt";

export const checkAuth = async ({
  headers: { authorization },
  jwt,
}: Pick<Context, "headers"> & JwtContext) => {
  if (!authorization || authorization.toString() === "") {
    throw unauthorized();
  }
  const token = authorization?.replace("Bearer ", "");

  const payload = await jwt.verify(token);
  if (!payload) {
    throw unauthorized();
  }

  const currentUser = await UserService.find(payload.id);

  return { token, currentUser };
};

export function unauthorized(cause?: any) {
  return error(401, {
    errors: { body: [cause ? `${cause}` : "Invalid credentials"] },
  });
}

export function forbidden(cause?: any) {
  return error(403, {
    errors: { body: [cause ? `${cause}` : "Forbidden"] },
  });
}

export function unprocessable(cause?: any) {
  return error(422, {
    errors: {
      body:
        cause?.length || 0 > 0
          ? cause
          : [cause ? `${cause}` : "Validation failed, check parameters"],
    },
  });
}

export function notFound(cause?: any) {
  return error(404, {
    errors: { body: [cause ? `${cause}` : "Invalid resource identifier"] },
  });
}

export function toSlug(str: string) {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function isDefined<T>(thing?: T | null | undefined): thing is T {
  return thing !== undefined && thing !== null;
}

export function isString(thing?: string | null | undefined): thing is string {
  return typeof thing === "string";
}
