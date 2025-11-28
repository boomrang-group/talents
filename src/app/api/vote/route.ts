// src/app/api/vote/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    return NextResponse.json({ message: "Le service Firestore n'est pas disponible." }, { status: 500 });
  }
  
  // Utiliser `headers()` de `next/headers` pour l'accès côté serveur
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('cf-connecting-ip') || request.ip;

  if (!ip) {
    return NextResponse.json({ message: "Impossible de vérifier l'unicité du vote. Adresse IP manquante." }, { status: 400 });
  }

  try {
    const { submissionId, challengeId } = await request.json();

    if (!submissionId || !challengeId) {
      return NextResponse.json({ message: "ID de la soumission et du défi sont requis." }, { status: 400 });
    }

    // Vérifier si cette IP a déjà voté pour ce défi
    const votesCol = collection(firestore, 'votes');
    const q = query(votesCol, where("ipAddress", "==", ip), where("challengeId", "==", challengeId), limit(1));
    const voteSnapshot = await getDocs(q);

    if (!voteSnapshot.empty) {
      return NextResponse.json({ message: "Vous avez déjà voté pour ce défi." }, { status: 403 });
    }

    // Utiliser une transaction pour s'assurer que le compteur de votes est mis à jour de manière atomique
    await runTransaction(firestore, async (transaction) => {
      const submissionRef = doc(firestore, 'submissions', submissionId);
      const submissionDoc = await transaction.get(submissionRef);

      if (!submissionDoc.exists()) {
        throw new Error("La soumission n'existe pas.");
      }

      const currentVotes = submissionDoc.data().votes || 0;
      const newVotes = currentVotes + 1;

      // Mettre à jour le compteur de votes sur la soumission
      transaction.update(submissionRef, { votes: newVotes });
      
      // Enregistrer le vote pour empêcher les votes multiples
      const voteData = {
        submissionId: submissionId,
        challengeId: challengeId,
        ipAddress: ip,
        votedAt: serverTimestamp(),
      };
      const newVoteRef = doc(collection(firestore, 'votes'));
      transaction.set(newVoteRef, voteData);
    });

    return NextResponse.json({ message: "Vote enregistré avec succès !" }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de transaction de vote:", error);
    return NextResponse.json({ message: error.message || "Une erreur interne est survenue." }, { status: 500 });
  }
}
