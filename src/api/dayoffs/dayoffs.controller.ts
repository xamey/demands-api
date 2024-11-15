import { Elysia, t } from "elysia";
import { checkAuth, forbidden, notFound } from "../../common/utils";
import { DayOffsService } from "./dayoffs.service";
import jwt from "../../common/jwt";
import { dayOffInsert } from "./dayoffs.schema";
import { formatDayOff } from "./dayoffs.util";

const dayOffsController = new Elysia()
  .use(jwt)
  .resolve(checkAuth)
  .get("dayoffs", async ({ currentUser }) => {
    const dayOffs = await DayOffsService.collect(currentUser.id);
    return { dayOffs: dayOffs.map(formatDayOff) };
  })
  .post(
    "dayoffs",
    async ({ body, currentUser }) => {
      if (body.dayoff.userId && !currentUser.superUser) {
        return forbidden();
      }

      const [dayOff] = await DayOffsService.create(currentUser.id, {
        ...body.dayoff,
        userId: body.dayoff.userId || currentUser.id,
      });
      return { dayOff: formatDayOff(dayOff) };
    },
    {
      body: t.Object({
        dayoff: t.Pick(dayOffInsert, ["date", "userId"]),
      }),
    }
  )
  .delete("dayoffs/:id", async ({ params, currentUser }) => {
    const dayOff = await DayOffsService.find(Number(params.id));
    if (!dayOff) {
      return notFound();
    }

    if (!currentUser.superUser && dayOff.userId !== currentUser.id) {
      return forbidden();
    }

    return await DayOffsService.delete(dayOff.id);
  })
  .patch(
    "dayoffs/:id",
    async ({ body, params, currentUser }) => {
      if (!currentUser?.superUser) {
        throw forbidden();
      }
      return await DayOffsService.modifyStatus(
        Number(params.id),
        body.dayoff.status as "approved" | "refused"
      );
    },
    {
      body: t.Object({
        dayoff: t.Pick(dayOffInsert, ["status"]),
      }),
    }
  );

export default dayOffsController;
