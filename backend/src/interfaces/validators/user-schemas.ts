import { z } from "zod";
export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});