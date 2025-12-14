// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Camera } from "lucide-react";
// import heroImage from "./hero-image.png"; // Same image as Registration page

// export default function ProfilePage() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState({ username: "", phone: "", profilePic: null });
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [success, setSuccess] = useState("");
//   const [errors, setErrors] = useState({});

//   // Fetch existing profile and user data
//   useEffect(() => {
//     if (!userId) return;
//     setFetchLoading(true);
//     fetch(`http://localhost:5000/api/profile/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.data) {
//           setProfile({
//             username: data.data.username || "",
//             phone: data.data.user?.phone || "",
//             profilePic: null,
//           });
//           if (data.data.profilePic) {
//             setPreview(`http://localhost:5000${data.data.profilePic}`);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching profile:", err);
//       })
//       .finally(() => {
//         setFetchLoading(false);
//       });
//   }, [userId]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "profilePic") {
//       setProfile((prev) => ({ ...prev, profilePic: files[0] }));
//       setPreview(URL.createObjectURL(files[0]));
//     } else {
//       setProfile((prev) => ({ ...prev, [name]: value }));
//     }
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!profile.username) return setErrors({ username: "Username is required" });

//     setLoading(true);
//     setSuccess("");
//     setErrors({});

//     const formData = new FormData();
//     formData.append("username", profile.username);
//     formData.append("phone", profile.phone);
//     if (profile.profilePic) formData.append("profilePic", profile.profilePic);

//     try {
//       const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSuccess("Profile saved successfully!");
//         setTimeout(() => {
//           setSuccess("");
//         }, 3000);
//       } else {
//         setErrors({ submit: data.message });
//       }
//     } catch (err) {
//       setErrors({ submit: "Network error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//         <div style={{ fontSize: "1.25rem", color: "#6b7280" }}>Loading profile...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
//         }
//         .profile-container {
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
//           font-size: 2rem;
//           font-weight: bold;
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
//           margin-bottom: 1rem;
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
//           width: 100%;
//         }
//         .subscribe-btn:hover {
//           background: rgba(255, 255, 255, 0.3);
//         }
//         .profile-main {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 2rem;
//           background-color: #f9fafb;
//         }
//         @media (min-width: 1024px) {
//           .profile-main {
//             width: 50%;
//           }
//         }
//         .profile-form-wrapper {
//           width: 100%;
//           max-width: 32rem;
//           background: white;
//           padding: 3rem;
//           border-radius: 1rem;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
//         }
//         .profile-header {
//           text-align: center;
//           margin-bottom: 2.5rem;
//         }
//         .profile-title {
//           font-size: 2rem;
//           font-weight: bold;
//           color: #111827;
//           margin-bottom: 0.5rem;
//         }
//         .profile-subtitle {
//           color: #6b7280;
//           font-size: 0.95rem;
//         }
//         .back-link {
//           color: #2563eb;
//           font-weight: 600;
//           background: none;
//           border: none;
//           cursor: pointer;
//           text-decoration: none;
//         }
//         .back-link:hover {
//           color: #1d4ed8;
//           text-decoration: underline;
//         }
//         .alert {
//           margin-bottom: 1.5rem;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           text-align: center;
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
//         .profile-pic-section {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 2rem;
//         }
//         .profile-pic-wrapper {
//           position: relative;
//           width: 120px;
//           height: 120px;
//           margin-bottom: 1rem;
//         }
//         .profile-pic-preview {
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 4px solid #e5e7eb;
//           background-color: #f3f4f6;
//         }
//         .profile-pic-placeholder {
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border: 4px solid #e5e7eb;
//           color: #9ca3af;
//           font-size: 3rem;
//           font-weight: bold;
//         }
//         .profile-pic-overlay {
//           position: absolute;
//           bottom: 0;
//           right: 0;
//           width: 36px;
//           height: 36px;
//           background-color: #2563eb;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           border: 3px solid white;
//           transition: all 0.3s;
//         }
//         .profile-pic-overlay:hover {
//           background-color: #1d4ed8;
//           transform: scale(1.05);
//         }
//         .profile-pic-input {
//           display: none;
//         }
//         .upload-text {
//           font-size: 0.875rem;
//           color: #6b7280;
//           text-align: center;
//         }
//         .form-group {
//           margin-bottom: 1.5rem;
//         }
//         .form-label {
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #374151;
//           margin-bottom: 0.5rem;
//           display: block;
//         }
//         .form-input {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           border: 1px solid #d1d5db;
//           border-radius: 0.5rem;
//           font-size: 1rem;
//           outline: none;
//           transition: all 0.2s;
//           background-color: white;
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
//           margin-top: 1rem;
//         }
//         .submit-btn:hover {
//           background-color: #1d4ed8;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//         }
//         .submit-btn:disabled {
//           background-color: #93c5fd;
//           cursor: not-allowed;
//           transform: none;
//         }
//         @media (max-width: 768px) {
//           .profile-form-wrapper {
//             padding: 2rem;
//           }
//           .profile-title {
//             font-size: 1.75rem;
//           }
//           .hero-title {
//             font-size: 2rem;
//           }
//         }
//       `}</style>

//       <div className="profile-container">
//         {/* Hero Section - Same as Registration Page */}
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

//         {/* Main Form Section */}
//         <div className="profile-main">
//           <div className="profile-form-wrapper">
//             <div className="profile-header">
//               <h2 className="profile-title">Complete Your Profile</h2>
//               <p className="profile-subtitle">
//                 Want to go back?{" "}
//                 <button onClick={() => navigate("/login")} className="back-link">
//                   Login
//                 </button>
//               </p>
//             </div>

//             {success && <div className="alert alert-success">{success}</div>}
//             {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

//             <form onSubmit={handleSubmit}>
//               {/* Profile Picture Upload */}
//               <div className="profile-pic-section">
//                 <div className="profile-pic-wrapper">
//                   {preview ? (
//                     <img src={preview} alt="Profile Preview" className="profile-pic-preview" />
//                   ) : (
//                     <div className="profile-pic-placeholder">
//                       {profile.username ? profile.username.charAt(0).toUpperCase() : "U"}
//                     </div>
//                   )}
//                   <label htmlFor="profilePic" className="profile-pic-overlay">
//                     <Camera size={20} color="white" />
//                   </label>
//                   <input
//                     type="file"
//                     id="profilePic"
//                     name="profilePic"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="profile-pic-input"
//                   />
//                 </div>
//                 <p className="upload-text">Click the camera icon to upload profile picture</p>
//               </div>

//               {/* Username - Only Field */}
//               <div className="form-group">
//                 <label className="form-label">Username</label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={profile.username}
//                   onChange={handleChange}
//                   placeholder="Enter your username"
//                   className={`form-input ${errors.username ? "input-error" : ""}`}
//                 />
//                 {errors.username && <p className="error-message">{errors.username}</p>}
//               </div>

//               <button type="submit" disabled={loading} className="submit-btn">
//                 {loading ? "Saving Profile..." : "Save Profile"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import heroImage from "./hero-image.png";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ username: "", phone: "", profilePic: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch existing profile and user data
  useEffect(() => {
    if (!userId) return;
    setFetchLoading(true);
    
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfile({
            username: data.data.username || "",
            phone: data.data.user?.phone || "",
            profilePic: null,
          });
          if (data.data.profilePic) {
            setPreview(`http://localhost:5000${data.data.profilePic}`);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setProfile((prev) => ({ ...prev, profilePic: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.username) return setErrors({ username: "Username is required" });

    setLoading(true);
    setSuccess("");
    setErrors({});

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("phone", profile.phone);
    if (profile.profilePic) formData.append("profilePic", profile.profilePic);

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess("Profile saved successfully! Redirecting to practice page...");
        
        // Save username to localStorage
        localStorage.setItem("username", profile.username);
        if (data.data.profilePic) {
          localStorage.setItem("profilePic", data.data.profilePic);
        }
        
        // Redirect to practice page after profile is complete
        setTimeout(() => {
          navigate("/practice");
        }, 2000);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: "1.25rem", color: "#6b7280" }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }
        .profile-container {
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
          font-size: 2rem;
          font-weight: bold;
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
          margin-bottom: 1rem;
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
          width: 100%;
        }
        .subscribe-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .profile-main {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #f9fafb;
        }
        @media (min-width: 1024px) {
          .profile-main {
            width: 50%;
          }
        }
        .profile-form-wrapper {
          width: 100%;
          max-width: 32rem;
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .profile-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .profile-title {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        .profile-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
        }
        .back-link {
          color: #2563eb;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .back-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .alert {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
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
        .profile-pic-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        .profile-pic-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 1rem;
        }
        .profile-pic-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e5e7eb;
          background-color: #f3f4f6;
        }
        .profile-pic-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #e5e7eb;
          color: #9ca3af;
          font-size: 3rem;
          font-weight: bold;
        }
        .profile-pic-overlay {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          background-color: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s;
        }
        .profile-pic-overlay:hover {
          background-color: #1d4ed8;
          transform: scale(1.05);
        }
        .profile-pic-input {
          display: none;
        }
        .upload-text {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          background-color: white;
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
          margin-top: 1rem;
        }
        .submit-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .submit-btn:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
          transform: none;
        }
        @media (max-width: 768px) {
          .profile-form-wrapper {
            padding: 2rem;
          }
          .profile-title {
            font-size: 1.75rem;
          }
          .hero-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="profile-container">
        {/* Hero Section */}
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

        {/* Main Form Section */}
        <div className="profile-main">
          <div className="profile-form-wrapper">
            <div className="profile-header">
              <h2 className="profile-title">Complete Your Profile</h2>
              <p className="profile-subtitle">
                Want to go back?{" "}
                <button onClick={() => navigate("/login")} className="back-link">
                  Login
                </button>
              </p>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <form onSubmit={handleSubmit}>
              {/* Profile Picture Upload */}
              <div className="profile-pic-section">
                <div className="profile-pic-wrapper">
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="profile-pic-preview" />
                  ) : (
                    <div className="profile-pic-placeholder">
                      {profile.username ? profile.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <label htmlFor="profilePic" className="profile-pic-overlay">
                    <Camera size={20} color="white" />
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="profile-pic-input"
                  />
                </div>
                <p className="upload-text">Click the camera icon to upload profile picture</p>
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Saving Profile..." : "Save Profile & Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}