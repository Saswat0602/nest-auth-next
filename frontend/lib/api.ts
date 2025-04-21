// Use a function to get the API URL to prevent hydration errors
const getApiUrl = () => {
  return typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3333'
    : 'http://localhost:3333';
};

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

export const api = {
  register: async (userData: RegisterData) => {
    const response = await fetch(`${getApiUrl()}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },
  
  login: async (credentials: LoginData) => {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },
  
  verifyOtp: async (data: VerifyOtpData) => {
    const response = await fetch(`${getApiUrl()}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${getApiUrl()}/user/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    return handleResponse(response);
  },
  
  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch(`${getApiUrl()}/user/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  getProfile: async (token: string) => {
    const response = await fetch(`${getApiUrl()}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};
