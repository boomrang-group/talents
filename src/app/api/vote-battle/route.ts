// src/app/api/vote-battle/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServices } from '@/lib/firebase';
import { doc, runTransaction, collection, addDoc, serverTimestamp, query, where, getDocs, limit, increment } from 'firebase/firestore';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const { firestore } = getFirebaseServices();
  if (!firestore) {
    return NextResponse.json({ message: "Le service Firestore n'est pas disponible." }, { status: 500 });
  }

  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('cf-connecting-ip') || request.ip;

  if (!ip) {
    return NextResponse.json({ message: "Impossible de vérifier l'unicité du vote. Adresse IP manquante." }, { status: 400 });
  }

  try {
    const { battleId, participant } = await request.json(); // participant will be 'A' or 'B'

    if (!battleId || !participant || !['A', 'B'].includes(participant)) {
      return NextResponse.json({ message: "ID de la battle et du participant sont requis." }, { status: 400 });
    }

    const votesCol = collection(firestore, 'battle_votes');
    const q = query(votesCol, where("ipAddress", "==", ip), where("battleId", "==", battleId), limit(1));
    const voteSnapshot = await getDocs(q);

    if (!voteSnapshot.empty) {
      return NextResponse.json({ message: "Vous avez déjà voté pour cette battle." }, { status: 403 });
    }

    await runTransaction(firestore, async (transaction) => {
      const battleRef = doc(firestore, 'battles', battleId);
      const battleDoc = await transaction.get(battleRef);

      if (!battleDoc.exists()) {
        throw new Error("La battle n'existe pas.");
      }

      const voteField = participant === 'A' ? 'votesA' : 'votesB';
      transaction.update(battleRef, { [voteField]: increment(1) });
      
      const newVoteRef = doc(collection(firestore, 'battle_votes'));
      transaction.set(newVoteRef, {
        battleId,
        votedFor: participant,
        ipAddress: ip,
        votedAt: serverTimestamp(),
      });
    });

    return NextResponse.json({ message: "Vote de battle enregistré avec succès !" }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de transaction de vote de battle:", error);
    return NextResponse.json({ message: error.message || "Une erreur interne est survenue." }, { status: 500 });
  }
}
