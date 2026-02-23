import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        loginId: loginId.trim(),
        password: password.trim(),
      });

      console.log("LOGIN RESPONSE 👉", res.data);
console.log("ROLE 👉", res.data.role);




      const { token, role, id } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      if (role === "Admin") {
  console.log("NAVIGATING TO 👉 /admin");
  navigate("/admin", { replace: true });
} else if (role === "Customer" || role === "User") {
  console.log("NAVIGATING TO 👉 /landing");
  navigate("/landing", { replace: true });
}
 else {
  console.log("UNKNOWN ROLE 👉", role);
}

    } catch (err) {
      const backendError = err.response?.data;

if (typeof backendError === "string") {
  setError(backendError);
} else {
  setError(backendError?.message || "Invalid credentials");
}

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      
      {/* ================= LEFT SIDE: BRAND CONTENT ================= */}
      <div className="hidden lg:flex w-[50%] relative flex-col p-16 justify-between overflow-hidden bg-[#f8fafc]">
        {/* Decorative Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-full bg-[#004d40]/5 -skew-x-12 translate-x-16" />
        
        {/* 1. LOGO AT THE TOP (REAL COLORS) */}
        <div className="relative z-10">
          <div className="bg-white inline-block p-4 rounded-2xl shadow-sm border border-slate-100">
            <img 
              src="/logo/logo.png" 
              alt="Medico Aid Logo" 
              className="h-16 object-contain" 
            />
          </div>
        </div>

        {/* 2. CENTER CONTENT: NEW DESIGN */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-6 flex items-center gap-2 text-[#004d40] font-bold uppercase tracking-widest text-sm">
            <span className="w-8 h-[2px] bg-cyan-500"></span>
            Medical Excellence
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 leading-tight">
            Shymma <br />
            <span className="text-[#004d40]">Surgicals</span>
          </h1>
          
          <p className="mt-6 text-slate-600 text-lg leading-relaxed">
            Your trusted gateway to premium healthcare products and 
            ISO-certified orthopedic solutions across the Kingdom.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="text-cyan-500" size={20} />
              <span>SFDA Registered Importer</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="text-cyan-500" size={20} />
              <span>ISO 13485:2016 Certified Quality</span>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM FOOTNOTE */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">
            © 2026 Medico Aid | Saudi Arabia
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM ================= */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        <div className="max-w-md w-full mx-auto">
          
          <header className="mb-12">
            {/* Mobile Logo Only */}
            <div className="lg:hidden mb-8">
               <img src="/logo/logo.png" alt="Logo" className="h-14 mx-auto" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Portal Sign In</h2>
            <p className="text-slate-500 font-medium text-lg">Enter your authorized credentials below.</p>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="sales@medicoaid.com"
                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#004d40]/5 focus:border-[#004d40] focus:bg-white outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <Link to="/forgot-password" size={14} className="text-xs font-bold text-cyan-600 hover:text-[#004d40]">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 px-5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#004d40]/5 focus:border-[#004d40] focus:bg-white outline-none transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#004d40]"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-15 py-4 bg-[#004d40] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#004d40]/20 hover:bg-[#00332b] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2">
             <ShieldCheck size={18} className="text-[#004d40]" />
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
               Secure 256-bit Encrypted Session
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
}