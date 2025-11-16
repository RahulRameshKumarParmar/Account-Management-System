import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Page = 'login' | 'register' | 'account';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

interface States {
    currentPage: Page,
    users: User[],
    currentUser: User | null,
    isIntialized: boolean,
}

export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    register: (userData: Omit<User, 'id'>) => boolean;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const initialState: States = {
    currentPage: 'login',
    users: [],
    currentUser: null,
    isIntialized: false,
}

// Safely parse JSON from localStorage
// Returns default value if parsing fails

const safeParseJSON = <T>(key: string, defaultValue: T): T => {
    try{
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    }
    catch (error){
        console.error(`Error parsing ${key} from localStorage:`, error);
        return defaultValue;
    }
};

// Safely save data to localStorage

const safeSaveToLocalStorage = <T>(key: string, value: T) : void => {
    try{
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch(error){
        console.error(`Error while saving ${key} to localStorage:`, error);
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        initializeAuth: (state) => {
            //First loading all users from localStorage
            const storedUsers = safeParseJSON<User[]>('allUsers', []);
            state.users = storedUsers;

            // Loading current user from localStorage
            const storedCurrentUser = safeParseJSON<User | null>('currentUser', null);
            state.currentUser = storedCurrentUser;

            // Loading current page from localStorage
            const storedPage = localStorage.getItem('page');
            if(storedPage === 'login' || storedPage === 'register' || storedPage === 'account'){
                state.currentPage = storedPage;
            }

            // Mark as initialize
            state.isIntialized = true;

        },

        changePage: ((state, action: PayloadAction<Page>) => {
            state.currentPage = action.payload;
            localStorage.setItem("page", action.payload);
        }),

        login: ((state, action: PayloadAction<{ email: string, password: string }>) => {

            const user = state.users.find((u: Pick<User, 'email' | 'password'>) => u.email === action.payload.email && u.password === action.payload.password);

            if (user) {
                state.currentUser = user;
                safeSaveToLocalStorage('currentUser', user);
                state.currentPage = 'account';
                localStorage.setItem('page', 'account');
            }
        }),

        register: ((state, action: PayloadAction<Omit<User, 'id'>>) => {

            // Create new user with unique ID
            const newUser: User = {
                ...action.payload,
                id: Date.now().toString()
            };

            state.users.push(newUser);
            state.currentUser = newUser;
            state.currentPage = "account";
            safeSaveToLocalStorage('currentUser', newUser);
            safeSaveToLocalStorage('allUsers', state.users);
            localStorage.setItem("page", 'account');
        }),

        logout: ((state) => {
            state.currentUser = null;
            state.currentPage = 'login';

            // Clearing localStorage after user logout
            localStorage.removeItem('currentUser');
            localStorage.setItem('page', 'login');
        }),

        updateUser: ((state, action) => {
            if (state.currentUser) {
                const updatedUser = { 
                    ...state.currentUser, 
                    ...action.payload 
                } as User

                state.currentUser = updatedUser;

                const index = state.users.findIndex(
                    (u) => u.id === state.currentUser!.id
                );
                if (index !== -1) {
                    state.users[index] = state.currentUser;
                    
                    safeSaveToLocalStorage('currentUser', updatedUser);
                    safeSaveToLocalStorage('allUsers', state.users);
                }
            }
        })
    }
})

export const { initializeAuth, changePage, login, register, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;