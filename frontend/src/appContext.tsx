import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextType{
  token: string| undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}


const AppContext = createContext<AppContextType | undefined> (undefined);

interface AppProviderProps{
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps>=({children})=>{
  const [token, setToken] = useState<string | undefined>(undefined)

  return (
    <AppContext.Provider value = {{token, setToken}} >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};