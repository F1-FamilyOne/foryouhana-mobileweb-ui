'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * @page: UserContextValue
 * @description: UserCseonukimxtValue
 * @author: seonukim
 * @date: 2026-01-26
 *
 * 화면 임시 테스트용으로 유저 아이디를 변경하고 싶을 때는
 * forcedUserId를 넣어주세요. (로컬 스토리지에 반영되지 않고 context사용 시 바뀝니다.)
 */

type UserContextValue = {
  userId: string;
  setUserId: (id: string) => void;
  ready: boolean;
  isForced: boolean;
};

export const UserContext = createContext<UserContextValue>({
  userId: '1',
  setUserId: () => {},
  ready: false,
  isForced: false,
});

const STORAGE_KEY = 'mock_userId';
const DEFAULT_USER_ID = '1';

type Props = {
  children: React.ReactNode;
  forcedUserId?: string;
};

export function UserContextProvider({ children, forcedUserId }: Props) {
  const [userId, setUserIdState] = useState(DEFAULT_USER_ID);
  const [ready, setReady] = useState(false);

  const isForced = !!forcedUserId;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (forcedUserId) {
      setUserIdState(forcedUserId);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initial = stored || DEFAULT_USER_ID;
      setUserIdState(initial);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, initial);
      }
    }
    setReady(true);
  }, [forcedUserId]);

  const setUserId = useCallback(
    (id: string) => {
      setUserIdState(id);

      if (!isForced) {
        localStorage.setItem(STORAGE_KEY, id);
      }
    },
    [isForced],
  );

  const value = useMemo(
    () => ({
      userId,
      setUserId,
      ready,
      isForced,
    }),
    [userId, setUserId, ready, isForced],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
