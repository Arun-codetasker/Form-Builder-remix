import { json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function loader({ request, params }) {
    const { id } = params;
    try {
        console.log("Fetching template");
        const template = await prisma.template.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!template) {
            return json({ success: false, message: 'Template not found' }, { status: 404 });
        }
        console.log("template.htmlStructure");
        return json({ success: true, htmlStructure: template.htmlStructure });
    } catch (error) {
        console.error('Error fetching template:', error);
        return json({ success: false, message: 'Failed to fetch template' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function action({ request, params }) {
    const { id } = params;
    if (request.method === 'DELETE') {
        try {
            const deletedTemplate = await prisma.template.delete({
                where: {
                    id: parseInt(id),
                },
            });

            if (!deletedTemplate) {
                return json({ success: false, message: 'Template not found' }, { status: 404 });
            }

            return json({ success: true, message: 'Template deleted successfully' });
        } catch (error) {
            console.error('Error deleting template:', error);
            return json({ success: false, message: 'Failed to delete template' }, { status: 500 });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        return json({ success: false, message: 'Method not allowed' }, { status: 405 });
    }
}
