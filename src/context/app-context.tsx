import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
    showCreditDialog: boolean;
    setShowCreditDialog: React.Dispatch<React.SetStateAction<boolean>>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showCreditDialog, setShowCreditDialog] = useState<boolean>(false);

    return (
        <AppContext.Provider value={{ showCreditDialog, setShowCreditDialog }}>
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within the AppLayout');
    }
    return context;
};
