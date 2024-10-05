import { User } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContext {
    userInfo: User | null;
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
}


const UserContext = createContext<UserContext | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const session = useSession();

    const getUserData = async () => {
        try {
            const res = await axios.post('/get-user-info');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (session.status === "authenticated") {

        }
    })

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};


export const useAppContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within the AppLayout');
    }
    return context;
};
