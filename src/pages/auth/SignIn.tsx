import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertCircle, Gavel, CheckCircle,
  Phone, ArrowLeft, Loader2, RotateCcw, ShieldCheck
  // Eye, EyeOff, Mail — email/password login (disabled)
} from 'lucide-react';
import { sendLoginOtp, verifyLoginOtp } from '@/services/auth';
// import { loginUser, loginWithGoogle } from '@/services/auth'; // email/google login (disabled)
import Cookies from 'js-cookie';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Google login (disabled)

import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';

// Brand gradient — same as SellersPage / BuyersPage
const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''; // (disabled)

const SignIn = () => {
  const navigate = useNavigate();

  // ─── OTP login state ──────────────────────────────────────────────────────────
  type OtpStep = 'phone' | 'verify';
  const [otpStep, setOtpStep] = useState<OtpStep>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Timer countdown ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ─── OTP login handlers ────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setIsLoading(true);
      const response = await sendLoginOtp({ phone: cleaned });
      setSessionId(response.sessionId);
      setOtpStep('verify');
      setTimeLeft(300);
      toast.success('OTP sent to your registered mobile number!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    const cleaned = phone.replace(/\D/g, '');
    try {
      setIsLoading(true);
      const response = await sendLoginOtp({ phone: cleaned });
      setSessionId(response.sessionId);
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      toast.success('OTP resent successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (el: HTMLInputElement, index: number) => {
    const val = el.value.replace(/\D/g, '');
    if (!val && el.value) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      setIsLoading(true);
      const response = await verifyLoginOtp({
        phone: phone.replace(/\D/g, ''),
        otp: otpCode,
        sessionId
      });
      if (response?.token) {
        Cookies.set('authToken', response.token, { expires: 7 });
        toast.success('Signed in successfully!');
        navigate('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      toast.error(message);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Disabled: email/password login ──────────────────────────────────────────
  // const handlePasswordSubmit = async (e: React.FormEvent) => { ... }

  // ─── Disabled: Google OAuth login ─────────────────────────────────────────────
  // const handleGoogleSuccess = async (...) => { ... }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">

      {/* ── Left panel — brand gradient left side ── */}
      <div
        className="hidden lg:flex lg:w-1/2 text-white p-12 flex-col justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-start mb-10">
            <img src={logo} alt="SalesBid" className="h-14" />
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white mb-5">
            Discover<br />
            <span
              style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Extraordinary
            </span>{' '}
            Inventory
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
            Join thousands of businesses sourcing curated wholesale inventory with confidence.
          </p>

          {/* Feature bullets */}
          <div className="space-y-3 mb-10">
            {[
              'Access to premium and rare collectibles',
              'Real-time bidding with live notifications',
              'Secure transactions and verified sellers',
            ].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: BTN_GRAD }}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-gray-300 text-sm">{text}</p>
              </div>
            ))}
          </div>

          {/* 2FA badge */}
          <div className="flex items-center gap-3 rounded-xl px-5 py-4 border border-white/10 bg-white/5 backdrop-blur-sm">
            <ShieldCheck className="h-7 w-7 text-orange-400 shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">Your account is protected with OTP-based sign-in.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-white">

        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center w-full mb-8">
          <img src={logo} alt="SalesBid" className="h-14 w-auto" />
        </div>

        <div className="w-full max-w-md space-y-7">

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-500 text-sm">Sign in to continue to your dashboard</p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               OTP LOGIN FLOW
          ══════════════════════════════════════════════════════════════════ */}

          {/* ── Step 1: Enter phone ── */}
          {otpStep === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-up">

              {/* Info banner */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-sm text-orange-700">
                  Enter your registered mobile number. We'll send a 6-digit OTP to verify your identity.
                </p>
              </div>

              {/* Phone input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm select-none border-r border-gray-200 pr-3">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setPhoneError('');
                    }}
                    placeholder="Enter 10-digit number"
                    className={`pl-16 h-12 text-base tracking-widest ${phoneError ? 'border-red-400' : 'border-gray-200'} focus:border-orange-400 focus:ring-orange-200`}
                    autoFocus
                  />
                </div>
                {phoneError && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />{phoneError}
                  </p>
                )}
              </div>

              {/* Send OTP button */}
              <button
                id="send-otp-btn"
                type="submit"
                disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                className="w-full h-12 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: BTN_GRAD }}
              >
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Sending OTP…</>
                ) : (
                  <><Phone className="h-5 w-5" />Send OTP</>
                )}
              </button>
            </form>
          )}

          {/* ── Step 2: Verify OTP ── */}
          {otpStep === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-up">

              {/* Back + info row */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => { setOtpStep('phone'); setOtp(['', '', '', '', '', '']); }}
                  className="mt-0.5 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    OTP sent to{' '}
                    <span
                      className="font-bold"
                      style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      +91 {phone}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Enter the 6-digit code below to sign in</p>
                </div>
              </div>

              {/* Timer + Resend — always visible */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Expires in</span>
                  <span className={`font-bold tabular-nums text-xs ${
                    timeLeft === 0 ? 'text-gray-400' : timeLeft < 30 ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || timeLeft > 0}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed
                    enabled:hover:bg-gray-50"
                  style={{
                    borderColor: timeLeft === 0 ? '#111827' : '#e5e7eb',
                    color: timeLeft === 0 ? '#111827' : '#9ca3af',
                  }}
                >
                  {isLoading ? (
                    <><Loader2 className="h-3 w-3 animate-spin" />Sending…</>
                  ) : (
                    <><RotateCcw className="h-3 w-3" />Resend OTP</>
                  )}
                </button>
              </div>

              {/* OTP boxes — compact black */}
              <div>
                <p className="text-xs text-gray-400 text-center mb-3">Enter the 6-digit code</p>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-box-${index}`}
                      ref={el => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      onChange={e => handleOtpChange(e.target as HTMLInputElement, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      disabled={isLoading}
                      className="text-center font-bold outline-none transition-all duration-150 bg-white
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        disabled:opacity-50"
                      style={{
                        width: '44px',
                        height: '48px',
                        fontSize: '20px',
                        borderRadius: '8px',
                        border: `2px solid ${digit ? '#111827' : '#e5e7eb'}`,
                        color: '#111827',
                        backgroundColor: digit ? '#f9fafb' : '#ffffff',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Verify button */}
              <button
                id="verify-otp-btn"
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                className="w-full h-12 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: BTN_GRAD }}
              >
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Verifying…</>
                ) : (
                  <><ShieldCheck className="h-5 w-5" />Verify & Sign In</>
                )}
              </button>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               DISABLED — Email / Password login (commented out)
          ══════════════════════════════════════════════════════════════════
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} ...>
              ...email + password fields + submit button...
            </form>
          )}
          ══════════════════════════════════════════════════════════════════ */}

          {/* ══════════════════════════════════════════════════════════════════
               DISABLED — Google OAuth login (commented out)
          ══════════════════════════════════════════════════════════════════
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} ... />
          </GoogleOAuthProvider>
          ══════════════════════════════════════════════════════════════════ */}

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold hover:opacity-80 transition-opacity"
              style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
