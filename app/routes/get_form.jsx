
import { json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loader = async () => {
    try {
        const templates = await prisma.template.findMany();

        console.log('Fetched template:', templates);
        return json({ success: true, templates});
    } catch (error) {
        console.error('Error handling fetch-templates request:', error);
        return json({ success: false, message: 'Failed to fetch templates' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
