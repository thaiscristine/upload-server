import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Readable } from 'node:stream';
import { z } from 'zod';

const uploadImageInput = z.object({
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable)
});

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export async function uploadImage(input: UploadImageInput){
    const { fileName, contentType, contentStream } = uploadImageInput.parse(input);

    if (!allowedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported file type');
    }
    
    //TODO: upload the image to Cloudflare R2
    console.log(`Uploading file: ${fileName} with content type: ${contentType}`);

    await db.insert(schema.uploads).values({
        name: fileName,
        remoteKey: fileName,
        remoteUrl: fileName,
    })
}