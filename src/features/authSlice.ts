import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Page = 'login' | 'register' | 'account' | 'adminLogin';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    lastLogin?: number;
}

interface States {
    currentPage: Page,
    users: User[],
    currentUser: User | null,
    isInitialized: boolean,
    adminLog: 'false' | 'true',
}

export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    register: (userData: Omit<User, 'id'>) => boolean;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    deleteUser: (email: string) => void;
}

const initialState: States = {
    currentPage: 'login',
    users: [],
    currentUser: null,
    isInitialized: false,
    adminLog: 'false',
}

// Safely parse JSON from localStorage
// Returns default value if parsing fails

const safeParseJSON = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    }
    catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return defaultValue;
    }
};

// Safely save data to localStorage

const safeSaveToLocalStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error(`Error while saving ${key} to localStorage:`, error);
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        initializeAuth: (state) => {
            //First loading all users from localStorage
            const storedUsers = safeParseJSON<User[]>('users', []);
            state.users = storedUsers;

            // Loading current user from localStorage
            const storedCurrentUser = safeParseJSON<User | null>('currentUser', null);
            state.currentUser = storedCurrentUser;

            // Loading current page from localStorage
            const storedPage = localStorage.getItem('page');
            if (storedPage === 'login' || storedPage === 'register' || storedPage === 'account') {
                state.currentPage = storedPage;
            }

            // Checking whether login is done by Admin or not
            try {
                const isAdminLog = localStorage.getItem('logginByAdmin') || '';
                const adminLogStatus = isAdminLog ? JSON.parse(isAdminLog) : null;
                state.adminLog = adminLogStatus;
            }
            catch(error){
                console.error('Error while parsing data from local Storage: ' + error);
            }

            // Mark as initialize
            state.isInitialized = true;

        },

        changePage: ((state, action: PayloadAction<Page>) => {
            state.currentPage = action.payload;
            localStorage.setItem("page", action.payload);
        }),

        login: ((state, action: PayloadAction<{ email: string, password: string }>) => {

            const userIndex = state.users.findIndex((u) => u.email === action.payload.email || u.password === action.payload.password);

            if (userIndex !== 1) {
                state.currentUser = state.users[userIndex];
                safeSaveToLocalStorage('currentUser', state.currentUser);
            }

            const user = state.users.find((u: Pick<User, 'email' | 'password'>) => u.email === action.payload.email && u.password === action.payload.password);

            if (user) {
                safeSaveToLocalStorage('users', state.users);

                state.currentPage = 'account';
                localStorage.setItem('page', 'account');
            }
        }),

        adminLogin: ((state, action: PayloadAction<{ email: string, password: string }>) => {
            if (action.payload.email === 'prakash@gmail.com' && action.payload.password === 'prakash123#$') {
                state.currentPage = 'account';
                localStorage.setItem('page', 'account');

                state.adminLog = 'true';
                localStorage.setItem('logginByAdmin', 'true');
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
            safeSaveToLocalStorage('users', state.users);
            localStorage.setItem("page", 'account');
        }),

        logout: ((state, action: PayloadAction<string | null>) => {
            state.currentUser = null;
            state.currentPage = 'login';

            // Clearing localStorage after user logout
            localStorage.setItem('page', 'login');
            safeSaveToLocalStorage('currentUser', state.currentUser);

            const userIndex: number = state.users.findIndex((u) => u.email === action.payload);

            if (userIndex !== -1) {
                state.users[userIndex].lastLogin = Date.now();
                safeSaveToLocalStorage('users', state.users);
            }
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
                    safeSaveToLocalStorage('users', state.users);
                }
            }
        }),

        deleteUser: ((state, action) => {
            state.users = state.users.filter((u) => u.email !== action.payload);
            state.currentUser = null;
            safeSaveToLocalStorage('users', state.users);
            localStorage.removeItem('currentUser');
            state.currentPage = 'login';
            localStorage.setItem('page', 'login');
        }),
    }
})

export const { initializeAuth, changePage, login, register, updateUser, logout, deleteUser, adminLogin } = authSlice.actions;
export default authSlice.reducer;