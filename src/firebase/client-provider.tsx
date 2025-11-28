'use client';
import { ReactNode } from 'react';
import {
  FirebaseProvider,
  initializeFirebase,
} from '.';

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const { firebaseApp, firestore, auth } = initializeFirebase();
  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
};
