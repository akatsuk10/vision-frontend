import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyEmailToken } = useAuth();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                toast.error('Invalid verification link');
                navigate('/signup');
                return;
            }

            try {
                const response = await verifyEmailToken(token);
                // If verification is successful, redirect to set password page with the temp token
                navigate(`/set-password?token=${response.tempToken}`);
            } catch (error) {
                toast.error('Failed to verify email');

            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [searchParams, navigate, verifyEmailToken]);

    return (
        <div className="container max-w-md mx-auto px-4 py-12">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Verifying your email</h1>
                <p className="text-muted-foreground">
                    {isVerifying
                        ? 'Please wait while we verify your email...'
                        : 'Redirecting you to set your password...'}
                </p>
            </div>
        </div>
    );
} 