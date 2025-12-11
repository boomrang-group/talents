// IMPORTANT: DO NOT MANUALLY ADD 'use client' TO THIS FILE.
// This file is intended for server-side or shared configuration and functions.
// Client-specific initialization should be handled in a dedicated client provider.

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): { firebaseApp: FirebaseApp, auth: Auth, firestore: Firestore } {
  if (!getApps().length) {
    // This is the standard initialization for client-side environments.
    // In server environments, environment variables for Firebase should be set up.
    return getSdks(initializeApp(firebaseConfig));
  }
  
  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp): { firebaseApp: FirebaseApp, auth: Auth, firestore: Firestore } {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
