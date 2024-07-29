import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node';

const prisma = new PrismaClient();

// Handler for POST request
export async function action({ request }) {
    let formData = await request.formData();
    let htmlStructure = formData.get('htmlStructure');

    function encodeHTML(html) {
        return encodeURIComponent(html);
    }
    const encodedHTML = encodeHTML(htmlStructure);
    let form_title = formData.get('form_title');

    // if (typeof htmlStructure !== 'string' || typeof form_title !== 'string') {
    //     return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400 });
    // }

    try {
        let template = await prisma.template.create({
            data: {
                form_title,
                encodedHTML,
            },
        });

        console.log('Saved template:', template);

        return new Response(JSON.stringify(template), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving template:', error);
        return new Response(JSON.stringify({ error: 'Failed to save template' }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}