import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Page = 'login' | 'register' | 'account' | 'adminLogin' | 'forget' | 'resetPassword';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    firstTimeLogin: number;
    lastLogin?: number;
}

interface OTPData {
    email: string;
    otp: number;
    expiresAt: number;
}

interface States {
    currentPage: Page,
    users: User[],
    currentUser: User | null,
    isInitialized: boolean,
    adminLog: 'false' | 'true',
    otpData: OTPData | null,
    otpLoading: boolean,
    otpError: string | null,
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
    otpData: null,
    otpLoading: false,
    otpError: null,
}

// Safely parse JSON from localStorage
// Returns default value if parsing fails

export const safeParseJSON = <T>(key: string, defaultValue: T): T => {
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

export const safeSaveToLocalStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error(`Error while saving ${key} to localStorage:`, error);
    }
};

export const generateOTPAsync = createAsyncThunk(
    'auth.generatorOTP',
    async (email: string) => {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpData: OTPData = {
            email,
            otp,
            expiresAt: Date.now() + 60_00000,
        }

        safeSaveToLocalStorage('OTP', otpData);
        console.log("OTP Generated: ", otp);

        return otpData;
    }
)

export const verifyOTPAsync = createAsyncThunk(
    'auth/verifyOTP',
    async (enteredOTP: string, { getState, rejectWithValue }) => {
        const { otpData } = (getState() as { auth: States }).auth;

        //Check if OTP exists
        if (!otpData) {
            return rejectWithValue('OTP not found');
        }

        if (Date.now() > otpData.expiresAt) {
            return rejectWithValue('OTP is expired');
        }

        if (otpData.otp.toString() !== enteredOTP) {
            return rejectWithValue('Invalid OTP');
        }
        localStorage.removeItem('OTP');
        return otpData.email;
    }
)

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
            if (storedPage === 'login' || storedPage === 'register' || storedPage === 'account' || storedPage === 'forget' || storedPage === 'adminLogin' || storedPage === 'resetPassword') {
                state.currentPage = storedPage;
            }

            // Checking whether login is done by Admin or not
            try {
                const isAdminLog = localStorage.getItem('logginByAdmin') || '';
                const adminLogStatus = isAdminLog ? JSON.parse(isAdminLog) : null;
                state.adminLog = adminLogStatus;
            }
            catch (error) {
                console.error('Error while parsing data from local Storage: ' + error);
            }

            const storedOTP = safeParseJSON<OTPData | null>('OTP', null);

            state.otpData = storedOTP && Date.now() <= storedOTP.expiresAt ? storedOTP : null;

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

        register: ((state, action: PayloadAction<Omit<User, 'id' | 'firstTimeLogin'>>) => {

            // Create new user with unique ID
            const newUser: User = {
                ...action.payload,
                id: Date.now().toString(),
                firstTimeLogin: Date.now()
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

        adminLogout: ((state) => {
            state.adminLog = 'false';
            localStorage.setItem('logginByAdmin', 'false');

            state.currentPage = 'adminLogin';
            localStorage.setItem('page', 'adminLogin');
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

        clearOTP(state) {
            state.otpData = null;
            state.otpError = null;
            localStorage.removeItem('OTP');
        },

        updateNewPassword(state, action:PayloadAction<string>) {
            const getUser = state.users.find((user) => user.email === state.otpData?.email);
            console.log(getUser);

            if (!getUser) return;

            if (getUser) {
                getUser.password = action.payload;
                safeSaveToLocalStorage('users', state.users);
                state.currentPage = 'login';
            }
        },
    },
    extraReducers: builder => {
        builder

            .addCase(generateOTPAsync.pending, state => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(generateOTPAsync.fulfilled, (state, action) => {
                state.otpLoading = false;
                state.otpData = action.payload;
            })
            .addCase(generateOTPAsync.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.error.message || 'OTP failed';
            })

            .addCase(verifyOTPAsync.pending, state => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyOTPAsync.fulfilled, state => {
                state.otpLoading = false;
                state.currentPage = 'resetPassword';
            })
            .addCase(verifyOTPAsync.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload as string;
            });
    }
})

export const { initializeAuth, changePage, login, register, updateUser, logout, deleteUser, adminLogin, adminLogout, clearOTP, updateNewPassword } = authSlice.actions;
export default authSlice.reducer;