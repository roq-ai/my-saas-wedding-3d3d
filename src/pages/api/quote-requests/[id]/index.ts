import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { quoteRequestValidationSchema } from 'validationSchema/quote-requests';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.quote_request
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getQuoteRequestById();
    case 'PUT':
      return updateQuoteRequestById();
    case 'DELETE':
      return deleteQuoteRequestById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getQuoteRequestById() {
    const data = await prisma.quote_request.findFirst(convertQueryToPrismaUtil(req.query, 'quote_request'));
    return res.status(200).json(data);
  }

  async function updateQuoteRequestById() {
    await quoteRequestValidationSchema.validate(req.body);
    const data = await prisma.quote_request.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteQuoteRequestById() {
    const data = await prisma.quote_request.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
