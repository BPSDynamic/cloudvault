

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ConfirmSignUpData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ConfirmResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

class MockAuthService {
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];
  private currentUser: AuthUser | null = null;
  private readonly STORAGE_KEY = 'cloudvault_mock_user';

  constructor() {
    // Check for persisted user
    const persisted = localStorage.getItem(this.STORAGE_KEY);
    if (persisted) {
      try {
        this.currentUser = JSON.parse(persisted);
      } catch (e) {
        console.error('Failed to parse persisted user', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  // Add auth state listener
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    this.authStateListeners.push(callback);
    // Determine if we should callback immediately? Usually yes for initial state.
    // However, existing code might expect it only on change.
    // Let's not invoke immediately to match typical subscription behavior, 
    // or checks `isAuthenticated` separately.
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners of auth state changes
  private notifyAuthStateListeners(user: AuthUser | null) {
    this.authStateListeners.forEach(callback => callback(user));
  }

  // Helper to save user
  private saveUser(user: AuthUser) {
    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.notifyAuthStateListeners(user);
  }

  // Helper to clear user
  private clearUser() {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.notifyAuthStateListeners(null);
  }

  // Sign up a new user
  async signUp(data: SignUpData) {
    // Mock successful signup
    // In a real mock, we might store "pending" users. 
    // For simplicity, we'll just say success and tell them to verify.
    return {
      success: true,
      isSignUpComplete: false,
      userId: 'mock-user-id-' + Date.now(),
      nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
      message: 'Account created successfully! Please check your email for verification code.',
    };
  }

  // Confirm sign up with verification code
  async confirmSignUp(data: ConfirmSignUpData) {
    return {
      success: true,
      isSignUpComplete: true,
      message: 'Email verified successfully! You can now sign in.',
    };
  }

  // Resend verification code
  async resendVerificationCode(email: string) {
    return {
      success: true,
      message: 'Verification code sent to your email',
    };
  }

  // Sign in
  async signIn(data: SignInData) {
    const mockUser: AuthUser = {
      id: 'mock-user-123',
      email: data.email,
      firstName: 'Test',
      lastName: 'User',
      isEmailVerified: true,
    };
    this.saveUser(mockUser);
    return {
      success: true,
      user: mockUser,
      message: 'Signed in successfully!',
    };
  }

  // Sign in with Google (Mock Bypass)
  async signInWithGoogle() {
    const mockUser: AuthUser = {
      id: 'mock-google-user-id',
      email: 'mock.google@cloudvault.com',
      firstName: 'Mock',
      lastName: 'Google User',
      isEmailVerified: true,
    };
    this.saveUser(mockUser);
    return { success: true };
  }

  // Sign out
  async signOut() {
    this.clearUser();
    return {
      success: true,
      message: 'Signed out successfully',
    };
  }

  // Reset password
  async resetPassword(data: ResetPasswordData) {
    return {
      success: true,
      nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' },
      message: 'Password reset code sent to your email',
    };
  }

  // Confirm reset password
  async confirmResetPassword(data: ConfirmResetPasswordData) {
    return {
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    };
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return !!this.currentUser;
  }
}

// Export singleton instance
export const authService = new MockAuthService();
