// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import heroImage from "./hero-image.png"; // Make sure this path is correct

// export default function RegistrationPage() {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!formData.phone) {
//       newErrors.phone = "Phone number is required";
//     } else if (formData.phone.replace(/\D/g, "").length < 10) {
//       newErrors.phone = "Phone number must be at least 10 digits";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }
//     if (!agreedToTerms) {
//       newErrors.terms = "You must agree to the Terms of Use and Privacy Policy";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage("Account created successfully! Redirecting to profile...");
//         setFormData({ email: "", phone: "", password: "", confirmPassword: "" });
//         setAgreedToTerms(false);
        
//         // Redirect to profile page after 1.5 seconds
//         setTimeout(() => {
//           navigate(`/profile/${data.data.id}`);
//         }, 1500);

//       } else {
//         setErrors({ submit: data.message || "Registration failed" });
//       }
//     } catch (error) {
//       setErrors({ submit: "Network error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ALL CSS INSIDE HERE */}
//       <style>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
//         }
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
//           .hero-section {
//             display: flex;
//           }
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
//         .subscription-card {
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(16px);
//           border-radius: 1rem;
//           padding: 2rem;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           max-width: 28rem;
//         }
//         .subscription-title {
//           font-size: 1.5rem;
//           font-weight: bold;
//         }
//         .subscribe-btn {
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//           padding: 0.75rem 1.5rem;
//           border-radius: 0.5rem;
//           font-weight: 600;
//           border: 1px solid rgba(255, 255, 255, 0.3);
//           cursor: pointer;
//           transition: all 0.3s;
//         }
//         .subscribe-btn:hover {
//           background: rgba(255, 255, 255, 0.3);
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
//           .form-section {
//             width: 50%;
//           }
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
//         .login-link {
//           color: #2563eb;
//           font-weight: 600;
//           background: none;
//           border: none;
//           cursor: pointer;
//           text-decoration: none;
//         }
//         .login-link:hover {
//           color: #1d4ed8;
//           text-decoration: underline;
//         }
//         .alert {
//           margin-bottom: 1.5rem;
//           padding: 1rem;
//           border-radius: 0.5rem;
//         }
//         .alert-success {
//           background-color: #f0fdf4;
//           border: 1px solid #bbf7d0;
//           color: #15803d;
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
//         .form-row {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 1.5rem;
//         }
//         @media (min-width: 768px) {
//           .form-row {
//             grid-template-columns: 1fr 1fr;
//           }
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
//         .terms-section {
//           display: flex;
//           align-items: flex-start;
//           gap: 0.75rem;
//         }
//         .terms-checkbox {
//           margin-top: 0.25rem;
//           width: 1.25rem;
//           height: 1.25rem;
//           accent-color: #2563eb;
//           cursor: pointer;
//         }
//         .terms-label {
//           font-size: 0.875rem;
//           color: #4b5563;
//         }
//         .terms-link {
//           color: #2563eb;
//           font-weight: 500;
//           background: none;
//           border: none;
//           cursor: pointer;
//           text-decoration: none;
//         }
//         .terms-link:hover {
//           color: #1d4ed8;
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
//         @media (max-width: 768px) {
//           .hero-title {
//             font-size: 2rem;
//           }
//           .form-title {
//             font-size: 1.875rem;
//           }
//         }
//       `}</style>

//       <div className="registration-container">
//         {/* Hero Section - Hidden on Mobile */}
//         <div className="hero-section">
//           <img src={heroImage} alt="Hero" className="hero-image" />
//           <div className="hero-overlay"></div>
//           <div className="hero-content">
//             <div className="logo">L</div>
//             <h1 className="hero-title">Welcome Back!</h1>
//             <p className="hero-description">
//               Join thousands of users who trust us with their data. Secure, fast, and reliable.
//             </p>
//             <div className="subscription-card">
//               <h3 className="subscription-title">Start Free Trial</h3>
//               <button className="subscribe-btn">Get Started</button>
//             </div>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="form-section">
//           <div className="form-wrapper">
//             <div className="form-header">
//               <h2 className="form-title">Create An Account</h2>
//               <p className="form-subtitle">
//                 Already have an account?{" "}
//                 <button onClick={() => navigate("/login")} className="login-link">
//                   Login
//                 </button>
//               </p>
//             </div>

//             {successMessage && <div className="alert alert-success">{successMessage}</div>}
//             {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

//             <form onSubmit={handleSubmit} className="form-content">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="nedusoft@gmail.com"
//                     className={`form-input ${errors.email ? "input-error" : ""}`}
//                   />
//                   {errors.email && <p className="error-message">{errors.email}</p>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="+1 --- ------ -----"
//                     className={`form-input ${errors.phone ? "input-error" : ""}`}
//                   />
//                   {errors.phone && <p className="error-message">{errors.phone}</p>}
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Password</label>
//                   <div className="password-input-wrapper">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Input your password"
//                       className={`form-input ${errors.password ? "input-error" : ""}`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="password-toggle"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                   {errors.password && <p className="error-message">{errors.password}</p>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Confirm Password</label>
//                   <div className="password-input-wrapper">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       placeholder="Input your password"
//                       className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="password-toggle"
//                     >
//                       {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                   {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
//                 </div>
//               </div>

//               <div className="terms-section">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={agreedToTerms}
//                   onChange={(e) => {
//                     setAgreedToTerms(e.target.checked);
//                     if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
//                   }}
//                   className="terms-checkbox"
//                 />
//                 <label htmlFor="terms" className="terms-label">
//                   By clicking Create account, I agree that I have read and accepted the{" "}
//                   <button type="button" onClick={() => alert("Terms")} className="terms-link">
//                     Terms of Use
//                   </button>{" "}
//                   and{" "}
//                   <button type="button" onClick={() => alert("Privacy")} className="terms-link">
//                     Privacy Policy
//                   </button>
//                   .
//                 </label>
//               </div>
//               {errors.terms && <p className="error-message">{errors.terms}</p>}

//               <button type="submit" disabled={loading} className="submit-btn">
//                 {loading ? "Creating Account..." : "Create Account"}
//               </button>
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

export default function RegistrationPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
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
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms of Use and Privacy Policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("userRole", data.data.role);
        
        setSuccessMessage("Account created successfully! Redirecting to profile...");
        setFormData({ email: "", phone: "", password: "", confirmPassword: "" });
        setAgreedToTerms(false);
        
        // Redirect to profile page to complete profile
        setTimeout(() => {
          navigate(`/profile/${data.data.id}`);
        }, 1500);

      } else {
        setErrors({ submit: data.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALL CSS INSIDE HERE */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
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
          .hero-section {
            display: flex;
          }
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
        .subscription-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 28rem;
        }
        .subscription-title {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .subscribe-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
        }
        .subscribe-btn:hover {
          background: rgba(255, 255, 255, 0.3);
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
          .form-section {
            width: 50%;
          }
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
        .login-link {
          color: #2563eb;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .login-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .alert {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .alert-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
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
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
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
        .terms-section {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .terms-checkbox {
          margin-top: 0.25rem;
          width: 1.25rem;
          height: 1.25rem;
          accent-color: #2563eb;
          cursor: pointer;
        }
        .terms-label {
          font-size: 0.875rem;
          color: #4b5563;
        }
        .terms-link {
          color: #2563eb;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .terms-link:hover {
          color: #1d4ed8;
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
        {/* Hero Section - Hidden on Mobile */}
        <div className="hero-section">
          <img src={heroImage} alt="Hero" className="hero-image" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="logo">L</div>
            <h1 className="hero-title">Welcome Back!</h1>
            <p className="hero-description">
              Join thousands of users who trust us with their data. Secure, fast, and reliable.
            </p>
            <div className="subscription-card">
              <h3 className="subscription-title">Start Free Trial</h3>
              <button className="subscribe-btn">Get Started</button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Create An Account</h2>
              <p className="form-subtitle">
                Already have an account?{" "}
                <button onClick={() => navigate("/login")} className="login-link">
                  Login
                </button>
              </p>
            </div>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nedusoft@gmail.com"
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 --- ------ -----"
                    className={`form-input ${errors.phone ? "input-error" : ""}`}
                  />
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Input your password"
                      className={`form-input ${errors.password ? "input-error" : ""}`}
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
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Input your password"
                      className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="terms-section">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  className="terms-checkbox"
                />
                <label htmlFor="terms" className="terms-label">
                  By clicking Create account, I agree that I have read and accepted the{" "}
                  <button type="button" onClick={() => alert("Terms")} className="terms-link">
                    Terms of Use
                  </button>{" "}
                  and{" "}
                  <button type="button" onClick={() => alert("Privacy")} className="terms-link">
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>
              {errors.terms && <p className="error-message">{errors.terms}</p>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}