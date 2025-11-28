// src/app/api/mux-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Mux from '@mux/mux-node';

// This function will verify the webhook signature
async function verifyWebhookSignature(request: NextRequest): Promise<boolean> {
    const signature = request.headers.get('mux-signature');
    const webhookSecret = process.env.MUX_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        console.warn('Webhook secret or signature missing.');
        return false;
    }

    try {
        const body = await request.text(); // Read the body as text
        // The Mux Node SDK's `Webhooks.verifyHeader` will throw an error if verification fails
        Mux.Webhooks.verifyHeader(body, signature, webhookSecret);
        return true;
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return false;
    }
}

export async function POST(request: NextRequest) {
    // IMPORTANT: You must verify the webhook signature to ensure the request is from Mux
    // For local testing, you might temporarily disable this, but it's crucial for production.
    const isVerified = await verifyWebhookSignature(await request.clone());
    if (!isVerified) {
        return NextResponse.json({ message: 'Signature verification failed.' }, { status: 401 });
    }
    
    const { firestore } = initializeFirebase();
    if (!firestore) {
        console.error('Firestore service is not available.');
        return NextResponse.json({ message: 'Internal Server Error: Firestore not configured' }, { status: 500 });
    }

    try {
        const event = await request.json();

        // We only care about the event when the video is ready for playback
        if (event.type === 'video.asset.ready') {
            const assetId = event.data.id;
            const playbackId = event.data.playback_ids?.[0]?.id;
            
            if (!assetId || !playbackId) {
                console.error('Asset ID or Playback ID missing in webhook payload');
                return NextResponse.json({ message: 'Missing asset or playback ID.' }, { status: 400 });
            }

            console.log(`Received asset ready event for asset: ${assetId}, playbackId: ${playbackId}`);

            // Find the submission in Firestore that matches this asset ID
            const submissionsRef = collection(firestore, 'submissions');
            const q = query(submissionsRef, where('muxAssetId', '==', assetId), where('status', '==', 'processing'));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn(`No submission found with muxAssetId: ${assetId} and status: processing`);
                return NextResponse.json({ message: `Submission for asset ${assetId} not found or already processed.` }, { status: 404 });
            }
            
            // Should only be one, but we loop just in case
            for (const doc of querySnapshot.docs) {
                console.log(`Updating submission ${doc.id} with playback ID.`);
                await updateDoc(doc.ref, {
                    muxPlaybackId: playbackId,
                    status: 'pending_review', // The video is ready, now it needs admin approval
                });
            }
        }
        
        // Always respond with 200 OK to Mux
        return NextResponse.json({ message: 'Webhook received.' }, { status: 200 });

    } catch (error) {
        console.error('Error processing Mux webhook:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
