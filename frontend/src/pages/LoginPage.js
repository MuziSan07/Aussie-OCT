// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import heroImage from "./hero-image.png"; // Make sure this is in the same folder
// import { loginUser } from "../api/api";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: "" });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setLoading(true);

//     try {
//       const data = await loginUser(formData);
//       if (data.success) {
//         alert("Login successful! Welcome back!");
//         // Redirect or save token here
//       } else {
//         setErrors({ submit: data.message || "Invalid email or password" });
//       }
//     } catch (err) {
//       setErrors({ submit: "Network error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ALL CSS EMBEDDED — SAME AS REGISTRATION PAGE */}
//       <style jsx>{`
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif; }
//         .registration-container {
//           display: flex;
//           min-height: 100vh;
//         }
//         .hero-section {
//           display: none;
//           width: 50%;
//           background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
//           position: relative;
//           overflow: hidden;
//         }
//         @media (min-width: 1024px) {
//           .hero-section { display: flex; }
//         }
//         .hero-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }
//         .hero-overlay {
//           position: absolute;
//           inset: 0;
//           background-color: rgba(0, 0, 0, 0.2);
//         }
//         .hero-content {
//           position: relative;
//           z-index: 10;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           padding: 3rem;
//           color: white;
//         }
//         .logo {
//           width: 5rem;
//           height: 5rem;
//           background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
//           border-radius: 1rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           margin-bottom: 3rem;
//           font-weight: bold;
//           font-size: 2rem;
//           color: white;
//         }
//         .hero-title {
//           font-size: 3rem;
//           font-weight: bold;
//           margin-bottom: 1.5rem;
//           line-height: 1.2;
//         }
//         .hero-description {
//           font-size: 1.125rem;
//           color: #bfdbfe;
//           margin-bottom: 3rem;
//           line-height: 1.75;
//           max-width: 28rem;
//         }
//         .form-section {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 2rem;
//           background-color: #f9fafb;
//         }
//         @media (min-width: 1024px) {
//           .form-section { width: 50%; }
//         }
//         .form-wrapper {
//           width: 100%;
//           max-width: 28rem;
//         }
//         .form-title {
//           font-size: 2.25rem;
//           font-weight: bold;
//           color: #111827;
//           margin-bottom: 0.5rem;
//         }
//         .form-subtitle {
//           color: #4b5563;
//           margin-bottom: 2rem;
//         }
//         .login-link, .register-link {
//           color: #2563eb;
//           font-weight: 600;
//           background: none;
//           border: none;
//           cursor: pointer;
//           text-decoration: none;
//         }
//         .login-link:hover, .register-link:hover {
//           color: #1d4ed8;
//           text-decoration: underline;
//         }
//         .alert {
//           margin-bottom: 1.5rem;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           text-align: center;
//         }
//         .alert-error {
//           background-color: #fef2f2;
//           border: 1px solid #fecaca;
//           color: #b91c1c;
//         }
//         .form-content {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//         }
//         .form-group {
//           display: flex;
//           flex-direction: column;
//         }
//         .form-label {
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #374151;
//           margin-bottom: 0.5rem;
//         }
//         .form-input {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           border: 1px solid #d1d5db;
//           border-radius: 0.5rem;
//           font-size: 1rem;
//           outline: none;
//           transition: all 0.2s;
//         }
//         .form-input:focus {
//           border-color: #2563eb;
//           box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
//         }
//         .input-error {
//           border-color: #ef4444 !important;
//         }
//         .error-message {
//           color: #ef4444;
//           font-size: 0.875rem;
//           margin-top: 0.25rem;
//         }
//         .password-input-wrapper {
//           position: relative;
//         }
//         .password-input-wrapper .form-input {
//           padding-right: 3rem;
//         }
//         .password-toggle {
//           position: absolute;
//           right: 0.75rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #6b7280;
//           background: none;
//           border: none;
//           cursor: pointer;
//         }
//         .password-toggle:hover {
//           color: #374151;
//         }
//         .forgot-password {
//           text-align: right;
//           margin-top: -0.5rem;
//           margin-bottom: 1rem;
//         }
//         .forgot-password-link {
//           color: #6b7280;
//           font-size: 0.875rem;
//           text-decoration: none;
//         }
//         .forgot-password-link:hover {
//           color: #2563eb;
//           text-decoration: underline;
//         }
//         .submit-btn {
//           width: 100%;
//           background-color: #2563eb;
//           color: white;
//           font-weight: 600;
//           padding: 0.875rem;
//           border-radius: 0.5rem;
//           border: none;
//           cursor: pointer;
//           transition: all 0.3s;
//           font-size: 1.1rem;
//         }
//         .submit-btn:hover {
//           background-color: #1d4ed8;
//         }
//         .submit-btn:disabled {
//           background-color: #93c5fd;
//           cursor: not-allowed;
//         }
//         .register-prompt {
//           text-align: center;
//           margin-top: 1.5rem;
//           color: #4b5563;
//           font-size: 0.875rem;
//         }
//       `}</style>

//       <div className="registration-container">
//         {/* Hero Section - Same as Registration */}
//         <div className="hero-section">
//           <img src={heroImage} alt="Hero" className="hero-image" />
//           <div className="hero-overlay"></div>
//           <div className="hero-content">
//             <div className="logo">L</div>
//             <h1 className="hero-title">Welcome Back!</h1>
//             <p className="hero-description">
//               Log in to access your account and continue where you left off.
//             </p>
//           </div>
//         </div>

//         {/* Login Form */}
//         <div className="form-section">
//           <div className="form-wrapper">
//             <div className="form-title">Welcome Back</div>
//             <p className="form-subtitle">
//               Don't have an account?{" "}
//               <a href="/register" className="register-link">Sign up</a>
//             </p>

//             {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

//             <form onSubmit={handleSubmit} className="form-content">
//               <div className="form-group">
//                 <label className="form-label">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="nedusoft@gmail.com"
//                   className={`form-input ${errors.email ? "input-error" : ""}`}
//                   required
//                 />
//                 {errors.email && <p className="error-message">{errors.email}</p>}
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Password</label>
//                 <div className="password-input-wrapper">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     className={`form-input ${errors.password ? "input-error" : ""}`}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="password-toggle"
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="error-message">{errors.password}</p>}
//               </div>

//               <div className="forgot-password">
//                 <a href="/forgot-password" className="forgot-password-link">
//                   Forgot password?
//                 </a>
//               </div>

//               <button type="submit" disabled={loading} className="submit-btn">
//                 {loading ? "Logging in..." : "Login"}
//               </button>

//               <p className="register-prompt">
//                 New here?{" "}
//                 <a href="/register" className="register-link">
//                   Create an account
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "./hero-image.png";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user data to localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("userRole", data.data.role);
        localStorage.setItem("userEmail", data.data.email);
        
        if (data.data.username) {
          localStorage.setItem("username", data.data.username);
        }
        if (data.data.profilePic) {
          localStorage.setItem("profilePic", data.data.profilePic);
        }

        // Role-based redirect
        if (data.data.role === "ADMIN") {
          // Admin goes to dashboard
          setTimeout(() => {
            navigate("/admin/chapter");
          }, 500);
        } else {
          // Student - check if profile is complete
          if (!data.data.hasProfile) {
            // No profile yet, redirect to complete profile
            setTimeout(() => {
              navigate(`/profile/${data.data.id}`);
            }, 500);
          } else {
            // Profile complete, redirect to practice page
            setTimeout(() => {
              navigate("/practice");
            }, 500);
          }
        }
      } else {
        setErrors({ submit: data.message || "Invalid email or password" });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif; 
        }
        .registration-container {
          display: flex;
          min-height: 100vh;
        }
        .hero-section {
          display: none;
          width: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .hero-section { display: flex; }
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          color: white;
        }
        .logo {
          width: 5rem;
          height: 5rem;
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          margin-bottom: 3rem;
          font-weight: bold;
          font-size: 2rem;
          color: white;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .hero-description {
          font-size: 1.125rem;
          color: #bfdbfe;
          margin-bottom: 3rem;
          line-height: 1.75;
          max-width: 28rem;
        }
        .form-section {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #f9fafb;
        }
        @media (min-width: 1024px) {
          .form-section { width: 50%; }
        }
        .form-wrapper {
          width: 100%;
          max-width: 28rem;
        }
        .form-title {
          font-size: 2.25rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        .form-subtitle {
          color: #4b5563;
          margin-bottom: 2rem;
        }
        .login-link, .register-link {
          color: #2563eb;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .login-link:hover, .register-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .alert {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
        }
        .alert-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .input-error {
          border-color: #ef4444 !important;
        }
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .password-input-wrapper {
          position: relative;
        }
        .password-input-wrapper .form-input {
          padding-right: 3rem;
        }
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
        }
        .password-toggle:hover {
          color: #374151;
        }
        .forgot-password {
          text-align: right;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
        }
        .forgot-password-link {
          color: #6b7280;
          font-size: 0.875rem;
          text-decoration: none;
        }
        .forgot-password-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        .submit-btn {
          width: 100%;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          padding: 0.875rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.1rem;
        }
        .submit-btn:hover {
          background-color: #1d4ed8;
        }
        .submit-btn:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        .register-prompt {
          text-align: center;
          margin-top: 1.5rem;
          color: #4b5563;
          font-size: 0.875rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .form-title {
            font-size: 1.875rem;
          }
        }
      `}</style>

      <div className="registration-container">
        {/* Hero Section */}
        <div className="hero-section">
          <img src={heroImage} alt="Hero" className="hero-image" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="logo">L</div>
            <h1 className="hero-title">Welcome Back!</h1>
            <p className="hero-description">
              Log in to access your account and continue where you left off.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-title">Welcome Back</div>
            <p className="form-subtitle">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")} className="register-link">
                Sign up
              </button>
            </p>

            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nedusoft@gmail.com"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>

              <div className="forgot-password">
                <a href="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="register-prompt">
                New here?{" "}
                <button onClick={() => navigate("/register")} className="register-link">
                  Create an account
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}