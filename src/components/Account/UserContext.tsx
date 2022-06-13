import * as React from 'react';
import { tokenKey } from 'consts';

type Action = { type: 'login'; payload: { token: string } } | { type: 'logout' };
type Dispatch = (action: Action) => void;
type State = { token: string | null };
type CountProviderProps = { children: React.ReactNode };

const UserStateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined
);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'login': {
      window.localStorage.setItem(tokenKey, action.payload.token);
      return { ...state, ...action.payload };
    }
    case 'logout': {
      window.localStorage.removeItem(tokenKey);
      return { ...state, token: null };
    }
  }
}

const initialState = (initialState: State) => {
  return { ...initialState, token: window.localStorage.getItem(tokenKey) };
};

function UserProvider({ children }: CountProviderProps) {
  const [state, dispatch] = React.useReducer(userReducer, { token: null }, initialState);

  const value = { state, dispatch };
  return <UserStateContext.Provider value={value}>{children}</UserStateContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, useUser };
