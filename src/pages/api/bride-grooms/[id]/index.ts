import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { brideGroomValidationSchema } from 'validationSchema/bride-grooms';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bride_groom
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBrideGroomById();
    case 'PUT':
      return updateBrideGroomById();
    case 'DELETE':
      return deleteBrideGroomById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBrideGroomById() {
    const data = await prisma.bride_groom.findFirst(convertQueryToPrismaUtil(req.query, 'bride_groom'));
    return res.status(200).json(data);
  }

  async function updateBrideGroomById() {
    await brideGroomValidationSchema.validate(req.body);
    const data = await prisma.bride_groom.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBrideGroomById() {
    const data = await prisma.bride_groom.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
