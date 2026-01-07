import { useState } from "react";
import { AuthCard } from "./AuthCard";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/authService";
import { EmailVerification } from "./EmailVerification";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onToggleMode: (mode: "login" | "register" | "forgot") => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.success) {
        // Clear any existing session before showing verification
        try {
          await authService.signOut();
        } catch (error) {
          // Ignore errors - this is just cleanup
        }

        toast({
          title: "Account created!",
          description: result.message,
        });
        setShowVerification(true);
      } else {
        toast({
          title: "Registration failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (showVerification) {
    return (
      <EmailVerification
        email={formData.email}
        onVerified={() => onToggleMode("login")}
        onBack={() => setShowVerification(false)}
      />
    );
  }

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create account</h1>
        <p className="text-muted-foreground">Join us today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            id="firstName"
            label="First name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={errors.firstName}
            placeholder="John"
          />
          <AuthInput
            id="lastName"
            label="Last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={errors.lastName}
            placeholder="Doe"
          />
        </div>

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          placeholder="john@example.com"
        />

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            placeholder="Create a strong password"
          />

          <AuthInput
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            placeholder="Repeat your password"
          />
        </div>

        <AuthButton type="submit" loading={loading}>
          Create account
        </AuthButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const result = await authService.signInWithGoogle();
            if (result.success) {
              navigate("/dashboard");
            }
          }}
          className="h-10 w-full rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <button
            onClick={() => onToggleMode("login")}
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthCard>
  );
};