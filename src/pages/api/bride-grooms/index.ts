import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { brideGroomValidationSchema } from 'validationSchema/bride-grooms';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBrideGrooms();
    case 'POST':
      return createBrideGroom();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBrideGrooms() {
    const data = await prisma.bride_groom
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'bride_groom'));
    return res.status(200).json(data);
  }

  async function createBrideGroom() {
    await brideGroomValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.quote_request?.length > 0) {
      const create_quote_request = body.quote_request;
      body.quote_request = {
        create: create_quote_request,
      };
    } else {
      delete body.quote_request;
    }
    const data = await prisma.bride_groom.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
