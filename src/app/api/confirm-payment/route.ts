// src/app/api/confirm-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServices } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const { firestore } = getFirebaseServices();
  if (!firestore) {
    return NextResponse.json({ message: "Le service Firestore n'est pas disponible." }, { status: 500 });
  }

  try {
    const { userProfileId } = await request.json();

    if (!userProfileId) {
      return NextResponse.json({ message: "L'identifiant de profil utilisateur est requis." }, { status: 400 });
    }

    const userDocRef = doc(firestore, 'users', userProfileId);

    // This is an optimistic update. The source of truth should be the payment provider's webhook.
    // However, for a better UX, we update the status here.
    await updateDoc(userDocRef, {
      paymentStatus: 'completed',
      paymentConfirmedAt: serverTimestamp(), // Add a timestamp for this action
    });

    return NextResponse.json({ message: "Statut de paiement mis à jour avec succès." }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de confirmation de paiement:", error);
    return NextResponse.json({ message: error.message || "Une erreur interne est survenue." }, { status: 500 });
  }
}
