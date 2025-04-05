import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export function Signup() {
    const navigate = useNavigate();
    const { signup, verifyEmail, setPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPasswordState] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'email' | 'verify' | 'password'>('email');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await signup(email);
            setStep('verify');
            toast.success('Verification code sent to your email');
        } catch (error) {
            toast.error('Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="container max-w-md mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create an account</h1>
                <p className="text-muted-foreground">
                    {step === 'email' && 'Enter your email to get started'}
                    {step === 'verify' && 'Enter the verification code sent to your email'}
                    {step === 'password' && 'Set your password'}
                </p>
            </div>

            {step === 'email' && (
                <>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Continue'}
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:underline font-medium"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </>
            )}

            {step === 'verify' && (
                <div>
                    <p className="text-center text-muted-foreground mb-4">
                        A verification link has been sent to your{email} . Please check your inbox and click the link to verify your account.
                    </p>
                </div>
            )}




        </div>
    );
} 