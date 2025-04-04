import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export function GoogleCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const loginAction = useStore((state) => state.login);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // Check if we have accessToken and user in the URL (from backend redirect)
                const params = new URLSearchParams(location.search);
                const tokenFromUrl = params.get('accessToken');
                const userData = params.get('user');

                if (tokenFromUrl && userData) {
                    // Save access token to localStorage
                    localStorage.setItem('accessToken', tokenFromUrl);

                    // Parse user data and update state
                    const user = JSON.parse(decodeURIComponent(userData));
                    loginAction(user);

                    toast.success('Successfully logged in with Google!');
                    navigate('/');
                    return;
                }

                // If we don't have the data in the URL, we need to get the code and send it to the backend
                const code = params.get('code');

                if (!code) {
                    toast.error('Authorization code not found');
                    navigate('/login');
                    return;
                }

                // Send the code to your backend
                const response = await axios.get(`http://localhost:5000/api/v1/auth/google?code=${code}`);

                // Extract access token and user data
                const { accessToken, user } = response.data;

                // Save access token to localStorage
                localStorage.setItem('accessToken', accessToken);

                // Update user state in the application
                loginAction(user);

                toast.success('Successfully logged in with Google!');

                // Redirect to home page
                navigate('/');
            } catch (error) {
                console.error('Google OAuth callback error:', error);
                toast.error('Failed to authenticate with Google');
                navigate('/login');
            } finally {
                setIsProcessing(false);
            }
        };

        handleGoogleCallback();
    }, [location, navigate, loginAction]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Processing Google Login</h1>
                <p className="text-muted-foreground">
                    {isProcessing ? 'Please wait while we complete your login...' : 'Redirecting...'}
                </p>
            </div>
        </div>
    );
} 