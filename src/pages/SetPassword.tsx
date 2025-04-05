import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import zxcvbn from 'zxcvbn';

export function SetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setPasswordWithToken, loginAction } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordStrength = password ? zxcvbn(password) : null;

    const getPasswordStrengthColor = (score: number) => {
        switch (score) {
            case 0: return 'bg-red-500';
            case 1: return 'bg-orange-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-lime-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    const passwordRequirements = [
        { check: password.length >= 8, text: 'At least 8 characters' },
        { check: /[A-Z]/.test(password), text: 'At least one uppercase letter' },
        { check: /[a-z]/.test(password), text: 'At least one lowercase letter' },
        { check: /[0-9]/.test(password), text: 'At least one number' },
        { check: /[^A-Za-z0-9]/.test(password), text: 'At least one special character' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = searchParams.get('token');

        if (!token) {
            toast.error('Invalid password reset link');
            navigate('/signup');
            return;
        }

        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordStrength?.score < 3) {
            toast.error('Please choose a stronger password');
            return;
        }

        setLoading(true);
        try {
            const response = await setPasswordWithToken(token, password);

            // Save the access token
            localStorage.setItem('accessToken', response.accessToken);

            // Get user profile
            const userdata = await fetch('http://localhost:5000/api/v1/auth/profile', {
                headers: {
                    Authorization: `Bearer ${response.accessToken}`
                }
            }).then(res => res.json());

            // Update user state
            loginAction(userdata.user);

            toast.success('Password set successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Set your password</h1>
                <p className="text-muted-foreground">
                    Choose a secure password for your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {password && (
                        <>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength?.score || 0)}`}
                                    style={{ width: `${((passwordStrength?.score || 0) + 1) * 20}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Password strength: {passwordStrength?.score === 4 ? 'Very Strong' :
                                    passwordStrength?.score === 3 ? 'Strong' :
                                        passwordStrength?.score === 2 ? 'Fair' :
                                            passwordStrength?.score === 1 ? 'Weak' : 'Very Weak'}
                            </p>
                            <div className="space-y-1 mt-2">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        {req.check ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={req.check ? 'text-green-500' : 'text-red-500'}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || (passwordStrength?.score || 0) < 3}
                >
                    {loading ? 'Setting Password...' : 'Set Password'}
                </Button>
            </form>
        </div>
    );
} 