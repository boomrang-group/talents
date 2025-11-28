
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      console.error('Firestore service is not available.');
      return new NextResponse('Internal Server Error: Firestore not configured', { status: 500 });
    }

    const formData = await request.formData();
    
    const userProfileId = formData.get('Reference') as string;
    const status = formData.get('Status') as string; // e.g., "SUCCESS", "FAILED"
    const amount = formData.get('Amount') as string;
    const currency = formData.get('Currency') as string;
    const operator = formData.get('Operator') as string;
    const phone = formData.get('Telephone') as string;

    if (!userProfileId || !status) {
      return new NextResponse('Bad Request: Missing Reference or Status', { status: 400 });
    }

    console.log(`Received MaxiCash notification for User Profile ID: ${userProfileId}, Status: ${status}`);

    const userDocRef = doc(firestore, 'users', userProfileId);
    const paymentStatus = status === 'SUCCESS' ? 'completed' : 'failed';
    const parsedAmount = amount ? parseFloat(amount) / 100 : 0;

    // Update the user's document with the payment status
    await updateDoc(userDocRef, {
      paymentStatus: paymentStatus,
      paymentNotifiedAt: serverTimestamp(),
      paymentAmount: parsedAmount,
      paymentCurrency: currency,
    });

    // Also log the full payment details in the 'payments' collection for auditing
    const paymentDocRef = doc(firestore, 'payments', userProfileId); // Use user ID as doc ID for easy lookup
    await setDoc(paymentDocRef, {
      reference: userProfileId,
      status: paymentStatus,
      amount: parsedAmount,
      currency,
      operator,
      phone,
      notifiedAt: serverTimestamp(),
      rawStatus: status,
    }, { merge: true });

    // Respond to MaxiCash to acknowledge receipt
    return new NextResponse('[OK]', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('MaxiCash notification processing error:', error);
    // Even on error, we might want to return 200 OK so MaxiCash doesn't keep retrying,
    // but for debugging, a 500 is more informative.
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
