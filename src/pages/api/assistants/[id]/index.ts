import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { assistantValidationSchema } from 'validationSchema/assistants';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.assistant
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAssistantById();
    case 'PUT':
      return updateAssistantById();
    case 'DELETE':
      return deleteAssistantById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAssistantById() {
    const data = await prisma.assistant.findFirst(convertQueryToPrismaUtil(req.query, 'assistant'));
    return res.status(200).json(data);
  }

  async function updateAssistantById() {
    await assistantValidationSchema.validate(req.body);
    const data = await prisma.assistant.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAssistantById() {
    const data = await prisma.assistant.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
