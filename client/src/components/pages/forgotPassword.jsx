import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); 
    const [step, setStep] = useState(1); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [terminalOtp, setTerminalOtp] = useState(''); 
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Validate email format before sending
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/getResetPwdOtp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.message || 'Failed to send OTP';
                if (data.otp) {
                    setTerminalOtp(data.otp);
                    setStep(2);
                    setSuccess(`OTP generated but email failed. Check terminal for OTP: ${data.otp}`);
                    return;
                }
                
                throw new Error(errorMsg);
            }

            setStep(2);
            setSuccess('OTP sent to your email!');

            if (data.otp) {
                setTerminalOtp(data.otp);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
            console.error('Error in handleEmailSubmit:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value === '' || (value.length === 1 && /^[0-9]$/.test(value))) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                const nextInput = document.getElementById(`forgot-password-otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter a complete 6-digit OTP');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/resetPwd', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    otp: otpCode,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }

            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/sign'), 2000);
        } catch (err) {
            setError(err.message || 'An error occurred during password reset');
            console.error('Error in handlePasswordReset:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#52667E',
            padding: '1rem',
            width: "1350px" ,
            
        }}>
            <div className="forgot-password-main-container" style={{ 
                width: '100%',
                maxWidth: '400px', 
                padding: '2rem', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                {step === 1 ? (
                    <div className="forgot-password-email-step">
                        <h2 className="forgot-password-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Forgot Password</h2>
                        <p className="forgot-password-instructions" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Enter your email to receive a password reset OTP</p>
                        
                        {error && <div className="forgot-password-error-message" style={{ color: 'red', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                        {success && <div className="forgot-password-success-message" style={{ color: 'green', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
                        
                        <form className="forgot-password-email-form" onSubmit={handleEmailSubmit}>
                            <div className="forgot-password-email-field" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="forgot-password-email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    id="forgot-password-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="forgot-password-send-otp-button"
                                disabled={isLoading}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    backgroundColor: '#2563eb', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                            
                            <div className="forgot-password-login-redirect" style={{ textAlign: 'center' }}>
                                Remember your password? <a href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Login here</a>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="forgot-password-otp-step">
                        <h2 className="forgot-password-reset-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h2>
                        <p className="forgot-password-otp-instructions" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Enter the 6-digit OTP sent to {email}</p>
                        
                        {terminalOtp && (
                            <div className="forgot-password-dev-otp" style={{ 
                                backgroundColor: '#f0f0f0', 
                                padding: '0.75rem', 
                                marginBottom: '1rem',
                                borderRadius: '4px',
                                textAlign: 'center'
                            }}>
                                <p style={{ margin: 0 }}>Development OTP: <strong>{terminalOtp}</strong></p>
                            </div>
                        )}
                        
                        {error && <div className="forgot-password-otp-error" style={{ color: 'red', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                        {success && <div className="forgot-password-otp-success" style={{ color: 'green', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
                        
                        <form className="forgot-password-reset-form" onSubmit={handlePasswordReset}>
                            <div className="forgot-password-otp-inputs" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        id={`forgot-password-otp-input-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={otp[index]}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        required
                                        style={{ 
                                            width: '2.5rem', 
                                            height: '2.5rem', 
                                            textAlign: 'center',
                                            fontSize: '1rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                ))}
                            </div>
                            
                            <div className="forgot-password-new-password-field" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="forgot-password-new-password" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                                <input
                                    type="password"
                                    id="forgot-password-new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            
                            <div className="forgot-password-confirm-password-field" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="forgot-password-confirm-password" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    id="forgot-password-confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="forgot-password-reset-button"
                                disabled={isLoading}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    backgroundColor: '#2563eb', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                            
                            <div className="forgot-password-resend-otp" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                Didn't receive OTP? 
                                <button 
                                    type="button" 
                                    className="forgot-password-resend-otp-button"
                                    onClick={handleEmailSubmit}
                                    style={{ 
                                        background: 'none',
                                        border: 'none',
                                        color: '#52667E',
                                        cursor: 'pointer',
                                        padding: '0 0.25rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Resend OTP
                                </button>
                            </div>
                            
                            <div className="forgot-password-back-to-email" style={{ textAlign: 'center' }}>
                                <button 
                                    type="button" 
                                    className="forgot-password-back-button"
                                    onClick={() => {
                                        setStep(1);
                                        setError('');
                                        setSuccess('');
                                        setOtp(['', '', '', '', '', '']);
                                    }}
                                    style={{ 
                                        background: 'none',
                                        border: 'none',
                                        color: '#52667E',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    ← Back to email entry
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;