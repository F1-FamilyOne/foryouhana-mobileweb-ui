'use client';

import { useContext } from 'react';
import { UserContext } from './UserContextProvider';

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return ctx;
}
