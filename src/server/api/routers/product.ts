import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getActive: protectedProcedure.query(async ({ ctx }) => {
    // return profile by id
    const product = ctx.prisma.product.findFirstOrThrow({
      where: {
        active: true,
        AND: {
          prices: {
            some: {
              active: true,
            },
          },
        },
      },
      include: {
        prices: true,
      },
    });
    return product;
  }),
});
