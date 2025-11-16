// src/app/api/mux/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

// Authenticate Mux
// IMPORTANT: You should use environment variables for your credentials
const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(req: NextRequest) {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    console.error("Mux credentials are not set in environment variables.");
    return NextResponse.json(
      { error: "Mux credentials are not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const asset = await Video.Assets.create({
      // We use `cors_origin: '*'` to allow uploads from any origin.
      // In a production environment, you should restrict this to your domain.
      // e.g., cors_origin: 'https://your-app-domain.com'
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        // Optional: You could also create a passthrough to link this asset
        // to a submission ID from your database from the very beginning.
        // passthrough: submissionId,
      },
    });

    if (!asset.upload_url || !asset.id) {
       throw new Error("Mux failed to create an upload URL.");
    }

    return NextResponse.json({
      upload_url: asset.upload_url,
      asset_id: asset.id,
    });
  } catch (error) {
    console.error("Error creating Mux upload URL:", error);
    return NextResponse.json(
      { error: "An error occurred while preparing the video upload." },
      { status: 500 }
    );
  }
}
