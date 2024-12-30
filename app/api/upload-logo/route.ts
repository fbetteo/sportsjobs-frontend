import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const S3 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT_URL, // Remove https:// prefix
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { company, image } = await req.json();
        
        console.log('Starting logo upload for company:', company); // Debug log

        if (!image || typeof image !== 'string') {
            throw new Error('Invalid image data');
        }

        // Remove data URL prefix if present
        const base64Data = image.includes('base64,') 
            ? image.split('base64,')[1] 
            : image;

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Clean company name for folder name
        const cleanCompanyName = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Generate unique filename
        const filename = `company-logos/${cleanCompanyName}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

        console.log('Attempting to upload to R2:', filename); // Debug log

        // Upload to R2
        await S3.send(new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: 'image/png',
        }));

        const logoUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}`;
        console.log('Upload successful, URL:', logoUrl); // Debug log

        return NextResponse.json({ url: logoUrl });
    } catch (error) {
        console.error('Logo upload error details:', {
            error,
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT_URL,
            bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME
        });
        
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Upload failed' 
        }, { status: 500 });
    }
}
