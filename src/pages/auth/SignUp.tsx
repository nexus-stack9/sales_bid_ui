import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { registerUser, sendRegistrationOtp, verifyRegistrationOtp } from "@/services/auth";
import {
  Eye, EyeOff, Gavel, CheckCircle, AlertCircle,
  ShoppingBag, Clock, Award, Loader2, UserPlus,
  RotateCcw, ShieldCheck,
} from "lucide-react";
import logoNoBg from "@/assets/logo.png";

const BTN_GRAD = "linear-gradient(to right, #FF6B3D, #FFB444)";

// Email verification states
type EmailVerifyState = "idle" | "sending" | "otp_sent" | "verifying" | "verified";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ─── Form data ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Inline email verification state ──────────────────────────────────────
  const [emailVerifyState, setEmailVerifyState] = useState<EmailVerifyState>("idle");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Countdown timer ───────────────────────────────────────────────────────
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
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ─── Form field handler ────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // If user edits email after sending OTP, reset verification
    if (name === "email" && emailVerifyState !== "idle") {
      setEmailVerifyState("idle");
      setEmailOtp(["", "", "", "", "", ""]);
      setEmailOtpError("");
      setTimeLeft(0);
    }
  };

  // ─── Send email OTP ────────────────────────────────────────────────────────
  const handleSendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address first" }));
      return;
    }
    setErrors(prev => ({ ...prev, email: "" }));
    setEmailOtpError("");
    try {
      setEmailVerifyState("sending");
      await sendRegistrationOtp({ email: formData.email });
      setEmailVerifyState("otp_sent");
      setTimeLeft(120);
      setEmailOtp(["", "", "", "", "", ""]);
      toast({ title: "OTP Sent", description: `Verification code sent to ${formData.email}` });
      // Auto-focus first OTP box after render
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setEmailVerifyState("idle");
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  // ─── Resend email OTP ──────────────────────────────────────────────────────
  const handleResendEmailOtp = async () => {
    if (timeLeft > 0) return;
    try {
      setEmailVerifyState("sending");
      await sendRegistrationOtp({ email: formData.email });
      setEmailVerifyState("otp_sent");
      setTimeLeft(120);
      setEmailOtp(["", "", "", "", "", ""]);
      setEmailOtpError("");
      toast({ title: "OTP Resent", description: `A new code has been sent to ${formData.email}` });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP";
      setEmailVerifyState("otp_sent");
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  // ─── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (el: HTMLInputElement, index: number) => {
    const val = el.value.replace(/\D/g, "");
    if (!val && el.value) return;
    const newOtp = [...emailOtp];
    newOtp[index] = val.slice(-1);
    setEmailOtp(newOtp);
    setEmailOtpError("");
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...emailOtp];
    pasted.split("").forEach((d, i) => { newOtp[i] = d; });
    setEmailOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ─── Verify email OTP ──────────────────────────────────────────────────────
  const handleVerifyEmailOtp = async () => {
    const code = emailOtp.join("");
    if (code.length !== 6) {
      setEmailOtpError("Please enter the complete 6-digit code");
      return;
    }
    try {
      setEmailVerifyState("verifying");
      await verifyRegistrationOtp({ email: formData.email, otp: code });
      setEmailVerifyState("verified");
      setTimeLeft(0);
      toast({ title: "Email Verified ✓", description: "Your email has been verified successfully." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setEmailOtpError(message);
      setEmailVerifyState("otp_sent");
      setEmailOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  // ─── Form validation ───────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = { firstName: "", lastName: "", email: "", password: "", phone: "" };
    let isValid = true;

    if (!formData.firstName.trim()) { newErrors.firstName = "First name is required"; isValid = false; }
    if (!formData.lastName.trim()) { newErrors.lastName = "Last name is required"; isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { newErrors.email = "Valid email is required"; isValid = false; }
    else if (emailVerifyState !== "verified") { newErrors.email = "Please verify your email first"; isValid = false; }

    const phoneRegex = /^[1-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s()\-+]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"; isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"; isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Must contain at least one uppercase letter"; isValid = false;
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Must contain at least one number"; isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ─── Final form submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      await registerUser(formData);
      toast({ title: "Account created!", description: "Welcome to SalesBid. Please sign in." });
      navigate("/signin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailOtpComplete = emailOtp.every(d => d !== "");
  const isOtpLoading = emailVerifyState === "sending" || emailVerifyState === "verifying";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-2/5 text-white p-10 flex-col justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >

        <div className="relative z-10">
          <div className="flex justify-start mb-10">
            <img src={logoNoBg} alt="SalesBid" className="h-14" />
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white mb-4">
            Join Our{" "}
            <span style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Exclusive
            </span>{" "}
            <br />Sourcing Community
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
            Create your account and start sourcing verified inventory and bulk lots from India's top B2B marketplace.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { icon: <ShoppingBag className="h-4 w-4" />, text: "Access rare items not available elsewhere" },
              { icon: <Clock className="h-4 w-4" />, text: "Streamlined B2B sourcing & live inventory updates" },
              { icon: <Award className="h-4 w-4" />, text: "All sellers authenticated by our expert team" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: BTN_GRAD }}>
                  {icon}
                </div>
                <p className="text-gray-300 text-sm">{text}</p>
              </div>
            ))}
          </div>

          {/* Email verify badge on left panel */}
          <div className="flex items-center gap-3 rounded-xl px-5 py-4 border border-white/10 bg-white/5 backdrop-blur-sm">
            <ShieldCheck className="h-7 w-7 text-orange-400 shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">Email Verification Required</p>
              <p className="text-xs text-gray-400 mt-0.5">Verify your email before completing registration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — single-page form ── */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-10 bg-white">

        <div className="flex lg:hidden justify-center mb-6">
          <img src={logoNoBg} alt="SalesBid" className="h-14 w-auto" />
        </div>

        <div className="w-full max-w-lg">
          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Your Account</h2>
            <p className="mt-2 text-gray-500 text-sm">Join thousands of businesses sourcing bulk inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Name row ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <Input
                  id="firstName" name="firstName" type="text" required
                  value={formData.firstName} onChange={handleChange}
                  className={`h-11 ${errors.firstName ? "border-red-400" : "border-gray-200"} focus:border-orange-400 focus:ring-orange-200`}
                  placeholder="Rahul"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <Input
                  id="lastName" name="lastName" type="text" required
                  value={formData.lastName} onChange={handleChange}
                  className={`h-11 ${errors.lastName ? "border-red-400" : "border-gray-200"} focus:border-orange-400 focus:ring-orange-200`}
                  placeholder="Sharma"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* ── Email with inline verify button ── */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>

              {/* Email input + Verify / Verified badge */}
              <div className="relative flex items-center">
                <Input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={formData.email} onChange={handleChange}
                  className={`h-11 pr-28 transition-all ${
                    emailVerifyState === "verified"
                      ? "border-gray-400"
                      : errors.email
                      ? "border-red-400"
                      : "border-gray-200"
                  } focus:border-gray-800 focus:ring-gray-200`}
                  placeholder="you@company.com"
                />

                {/* Verified badge */}
                {emailVerifyState === "verified" && (
                  <div className="absolute right-2 flex items-center gap-1 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}

                {/* Verify button — idle / sending */}
                {emailVerifyState !== "verified" && emailVerifyState !== "otp_sent" && (
                  <button
                    type="button"
                    id="verify-email-btn"
                    onClick={handleSendEmailOtp}
                    disabled={isOtpLoading || !formData.email}
                    className="absolute right-2 h-7 px-3 text-xs font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {emailVerifyState === "sending" ? (
                      <><Loader2 className="h-3 w-3 animate-spin" />Sending…</>
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}

                {/* Code sent label */}
                {emailVerifyState === "otp_sent" && (
                  <div className="absolute right-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                    Code sent
                  </div>
                )}
              </div>

              {/* Email error */}
              {errors.email && emailVerifyState !== "verified" && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.email}
                </p>
              )}

              {/* ── Inline OTP section ── */}
              {(emailVerifyState === "otp_sent" || emailVerifyState === "verifying") && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">

                  {/* Timer + Resend — always visible */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Expires in</span>
                      <span className={`text-xs font-bold tabular-nums ${
                        timeLeft === 0 ? 'text-gray-400' : timeLeft < 30 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      disabled={isOtpLoading || timeLeft > 0}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                      style={{
                        borderColor: timeLeft === 0 ? '#111827' : '#e5e7eb',
                        color: timeLeft === 0 ? '#111827' : '#9ca3af',
                      }}
                    >
                      {isOtpLoading ? (
                        <><Loader2 className="h-3 w-3 animate-spin" />Sending…</>
                      ) : (
                        <><RotateCcw className="h-3 w-3" />Resend</>
                      )}
                    </button>
                  </div>

                  {/* OTP boxes — compact black */}
                  <div className="flex justify-center gap-2 mb-3">
                    {emailOtp.map((digit, index) => (
                      <input
                        key={index}
                        id={`email-otp-${index}`}
                        ref={el => { otpRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        onChange={e => handleOtpChange(e.target as HTMLInputElement, index)}
                        onKeyDown={e => handleOtpKeyDown(e, index)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        disabled={emailVerifyState === "verifying"}
                        className="text-center font-bold outline-none transition-all duration-150 bg-white
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                          disabled:opacity-50"
                        style={{
                          width: '40px',
                          height: '44px',
                          fontSize: '18px',
                          borderRadius: '8px',
                          border: `2px solid ${digit ? '#111827' : '#e5e7eb'}`,
                          color: '#111827',
                          backgroundColor: digit ? '#f9fafb' : '#ffffff',
                        }}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {emailOtpError && (
                    <p className="text-xs text-red-500 flex items-center justify-center gap-1 mb-2">
                      <AlertCircle className="h-3 w-3" />{emailOtpError}
                    </p>
                  )}

                  {/* Confirm button */}
                  <button
                    type="button"
                    id="confirm-otp-btn"
                    onClick={handleVerifyEmailOtp}
                    disabled={!isEmailOtpComplete || emailVerifyState === "verifying"}
                    className="w-full h-9 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700"
                  >
                    {emailVerifyState === "verifying" ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" />Verifying…</>
                    ) : (
                      <><CheckCircle className="h-3.5 w-3.5" />Confirm Code</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ── Phone ── */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm select-none border-r border-gray-200 pr-3">
                  +91
                </span>
                <Input
                  id="phone" name="phone" type="tel" inputMode="numeric" required
                  value={formData.phone}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData(prev => ({ ...prev, phone: v }));
                  }}
                  className={`h-11 pl-14 tracking-wider ${errors.phone ? "border-red-400" : "border-gray-200"} focus:border-orange-400 focus:ring-orange-200`}
                  placeholder="10-digit number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.phone}
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password" required
                  value={formData.password} onChange={handleChange}
                  className={`h-11 pr-10 ${errors.password ? "border-red-400" : "border-gray-200"} focus:border-orange-400 focus:ring-orange-200`}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.password}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">At least 8 characters with one uppercase letter and one number</p>
              )}
            </div>

            {/* ── Terms ── */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms" name="terms" type="checkbox" required
                className="h-4 w-4 mt-0.5 rounded border-gray-300 cursor-pointer"
                style={{ accentColor: "#FF6B3D" }}
              />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="font-semibold hover:opacity-80"
                  style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Terms of Service
                </Link>{" "}and{" "}
                <Link to="/privacy" className="font-semibold hover:opacity-80"
                  style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* ── Submit ── */}
            <button
              id="create-account-btn"
              type="submit"
              disabled={isSubmitting || emailVerifyState !== "verified"}
              className="w-full h-12 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: BTN_GRAD }}
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" />Creating account…</>
              ) : (
                <><UserPlus className="h-5 w-5" />Create Account</>
              )}
            </button>

            {/* Email not verified hint */}
            {emailVerifyState !== "verified" && (
              <p className="text-center text-xs text-amber-600 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Please verify your email to enable account creation
              </p>
            )}

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signin" className="font-bold hover:opacity-80 transition-opacity"
                style={{ background: BTN_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
