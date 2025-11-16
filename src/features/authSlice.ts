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
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        changePage: ((state, action: PayloadAction<Page>) => {
            state.currentPage = action.payload;
            localStorage.setItem("page", action.payload);
        }),

        login: ((state, action: PayloadAction<{ email: string, password: string }>) => {

            const getData = localStorage.getItem('allUsers') || '[]';
            const getUsersData = JSON.parse(getData);
            const user = getUsersData.find((u: Pick<User, 'email' | 'password'>) => u.email === action.payload.email && u.password === action.payload.password);

            if (user) {
                state.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                state.currentPage = 'account';
                localStorage.setItem('page', 'account');
            }
        }),

        register: ((state, action: PayloadAction<Omit<User, 'id'>>) => {

            const newUser: User = {
                ...action.payload,
                id: Date.now().toString()
            };

            state.users.push(newUser);
            state.currentUser = newUser;
            state.currentPage = "account";
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('allUsers', JSON.stringify(state.users));
            localStorage.setItem("page", 'account');
        }),

        logout: ((state) => {
            state.currentUser = null;
            state.currentPage = 'login';

            localStorage.setItem('page', 'login');
        }),

        updateUser: ((state, action) => {
            if (state.currentUser) {
                const updatedUser = { ...state.currentUser, ...action.payload } as User
                state.currentUser = updatedUser;
                const index = state.users.findIndex(
                    (u) => u.id === state.currentUser!.id
                );
                if (index !== -1) {
                    state.users[index] = state.currentUser;
                    localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
                }
            }
        })
    }
})

export const { changePage, login, register, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;