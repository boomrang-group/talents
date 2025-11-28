// src/firebase/firestore/use-doc.tsx
'use client';
import { useEffect, useState, useMemo } from 'react';
import { DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';

export interface UseDoc<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | null
): UseDoc<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedDocRef = useMemo(() => docRef, [docRef]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, loading, error };
}
