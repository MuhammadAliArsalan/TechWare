// import React, { useState } from "react";
// import "./signUp.css";
// // import { useNavigate } from 'react-router-dom';
// // const navigate = useNavigate();


// const SignIn = () => {
//   const [rightPanelActive, setRightPanelActive] = useState(false);
//   // const [selectedValue, setSelectedValue] = useState("");
  
//   // Sign Up State
//   const [signUpData, setSignUpData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     address: "",
//     role: "",
//   });

//   // Sign In State
//   const [signInData, setSignInData] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });
  
//   // Handle Sign Up Input Changes
//   const handleSignUpChange = (e) => {
//     setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
//   };

//   // Handle Sign In Input Changes
//   const handleSignInChange = (e) => {
//     setSignInData({ ...signInData, [e.target.name]: e.target.value });
//   };
  
//   // Handle Sign Up Submission
//   const handleSignUpSubmit = (e) => {
//     e.preventDefault();
  
//     if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword || !signUpData.phone || !signUpData.address || !signUpData.role) {
//       alert("All fields are required!");
//       return;
//     }
  
//     if (signUpData.password !== signUpData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
  
//     if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
//       alert("Invalid email format!");
//       return;
//     }
  
//     console.log("Form submitted:", signUpData);
//     sendDataToBackend(signUpData);
//   };

//   // Handle Sign In Submission
//   const handleSignInSubmit = async (event) => {
//     event.preventDefault();

//     if (!signInData.email || !signInData.password || !signInData.role) {
//       alert("All fields are required!");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(signInData),
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage);
//       }

//       const data = await response.text();

//       if (response.status === 200) {
//         alert("Login successful!");
//         if (signInData.role === "Admin") navigate("/admin-dashboard");
//         else if (signInData.role === "Seller") navigate("/seller-dashboard");
//         else navigate("/buyer-dashboard");
//       } else {
//         alert(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Something went wrong!");
//     }
//   };
  

//   return (
//     <div className={`sign_container ${rightPanelActive ? "right-panel-active" : ""}`} id="container">

//       {/* Sign Up Form */}
//       <div className="form-container sign-up-container">
//         <form onSubmit={handleSignUpSubmit}>
//           <h1>Create Account</h1>
//           {/* <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div> */}
//           {/* <span>or use your email for registration</span> */}
//           <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" />
//           <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" />
//           <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" />
//           <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" />
//           <input type= "tel" name="phone" value={signUpData.phone} onChange={handleSignUpChange} placeholder="Phone Number" />
//           <input type="text" name="address" value={signUpData.address} onChange={handleSignUpChange} placeholder="Address" /><br/>
//           <select className="styled-dropdown" name="role" value={signUpData.role} onChange={handleSignUpChange} >
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>

//           <button type="submit" id="mainSignUp" className="sign_button">Sign Up</button>
//         </form>
//       </div>

//       {/* Sign In Form */}
//       <div className="form-container sign-in-container">
//         <form onSubmit={handleSignInSubmit}>
//           <h1>Sign In</h1>
//           {/* <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div> */}
//           {/* <span>or use your account</span> */}
//           <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" />
//           <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" />
//           {/* <a href="#">Forgot your password?</a> */}
//           <select className="styled-dropdown" name="role" value={signInData.role} onChange={handleSignInChange} >
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>
//           <button type="submit" id="mainSignIn" className="sign_button">Sign In</button>
//         </form>
//       </div>

//       {/* Overlay Panel */}
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Hello, Friend!</h1>
//             <h4>Enter your personal details and start your journey with us</h4>
//             <p>Already have an account?</p>
//             <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Welcome Back!</h1>
//             <h4>To keep connected with us, please login with your personal info</h4>
//             <p>New around here?</p>
//             <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;





// import React, { useState } from "react";
// import { useNavigate, Link } from 'react-router-dom';
// import "./signUp.css";

// const SignIn = () => {
//   const [rightPanelActive, setRightPanelActive] = useState(false);
//   const navigate = useNavigate();
  
//   // Sign Up State
//   const [signUpData, setSignUpData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phoneNo: "",
//     address: "",
//     role: "",
//   });

//   // Sign In State
//   const [signInData, setSignInData] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle Sign Up
//   const handleSignUpSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Validation
//     if (!signUpData.name || !signUpData.email || !signUpData.password || 
//         !signUpData.confirmPassword || !signUpData.phoneNo || !signUpData.address || !signUpData.role) {
//       setError("All fields are required!");
//       setIsLoading(false);
//       return;
//     }

//     if (signUpData.password !== signUpData.confirmPassword) {
//       setError("Passwords do not match!");
//       setIsLoading(false);
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
//       setError("Invalid email format!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/users/signUp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: signUpData.name,
//           email: signUpData.email,
//           password: signUpData.password,
//           confirmPassword: signUpData.confirmPassword,
//           phoneNo: signUpData.phoneNo,
//           address: signUpData.address,
//           role: signUpData.role.toLowerCase() // Convert to lowercase for backend
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Reset form and show success
//       setSignUpData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         phoneNo: "",
//         address: "",
//         role: "",
//       });
//       alert('Registration successful! Please sign in.');
//       setRightPanelActive(false); // Switch to sign in panel
//     } catch (err) {
//       setError(err.message);
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Sign In
//   const handleSignInSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     if (!signInData.email || !signInData.password || !signInData.role) {
//       setError("All fields are required!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // Important for cookies
//         body: JSON.stringify({
//           email: signInData.email,
//           password: signInData.password,
//           role: signInData.role.toLowerCase() // Convert to lowercase for backend
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // Redirect based on role
//       switch(signInData.role.toLowerCase()) {
//         case "admin":
//           navigate("/adminAnalytics");
//           break;
//         case "seller":
//           navigate("/seller-dashboard");
//           break;
//         case "buyer":
//           navigate("/buyer-dashboard");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       setError(err.message);
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUpChange = (e) => {
//     setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSignInChange = (e) => {
//     setSignInData({ ...signInData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   return (
//     <div className={`sign_container ${rightPanelActive ? "right-panel-active" : ""}`} id="container">
//       {/* Sign Up Form */}
//       <div className="form-container sign-up-container">
//         <form onSubmit={handleSignUpSubmit}>
//           <h1>Create Account</h1>
//           {error && <div className="error-message">{error}</div>}
//           <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" />
//           <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" />
//           <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" />
//           <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" />
//           <input type="tel" name="phoneNo" value={signUpData.phoneNo} onChange={handleSignUpChange} placeholder="Phone Number" />
//           <input type="text" name="address" value={signUpData.address} onChange={handleSignUpChange} placeholder="Address" />
//           <select className="styled-dropdown" name="role" value={signUpData.role} onChange={handleSignUpChange}>
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>
//           <button type="submit" className="sign_button" disabled={isLoading}>
//             {isLoading ? "Processing..." : "Sign Up"}
//           </button>
//         </form>
//       </div>

//       {/* Sign In Form */}
//       <div className="form-container sign-in-container">
//         <form onSubmit={handleSignInSubmit}>
//           <h1>Sign In</h1>
//           {error && <div className="error-message">{error}</div>}
//           <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" />
//           <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" />
//           <Link to="/forgot-password">Forgot your password?</Link>
//           <select className="styled-dropdown" name="role" value={signInData.role} onChange={handleSignInChange}>
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>
//           <button type="submit" className="sign_button" disabled={isLoading}>
//             {isLoading ? "Processing..." : "Sign In"}
//           </button>
//         </form>
//       </div>

//       {/* Overlay Panel */}
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Hello, Friend!</h1>
//             <h4>Enter your personal details and start your journey with us</h4>
//             <p>Already have an account?</p>
//             <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Welcome Back!</h1>
//             <h4>To keep connected with us, please login with your personal info</h4>
//             <p>New around here?</p>
//             <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


// import React, { useState } from "react";
// import { useNavigate, Link } from 'react-router-dom';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// import "./signUp.css";

// const SignIn = () => {
//   const [rightPanelActive, setRightPanelActive] = useState(false);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const redirect = searchParams.get('redirect') || '/';
  
//   // Sign Up State
//   const [signUpData, setSignUpData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phoneNo: "",
//     address: "",
//     role: "",
//   });

//   // Sign In State
//   const [signInData, setSignInData] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle Sign Up
//   const handleSignUpSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Validation
//     if (!signUpData.name || !signUpData.email || !signUpData.password || 
//         !signUpData.confirmPassword || !signUpData.phoneNo || !signUpData.address || !signUpData.role) {
//       setError("All fields are required!");
//       setIsLoading(false);
//       return;
//     }

//     if (signUpData.password !== signUpData.confirmPassword) {
//       setError("Passwords do not match!");
//       setIsLoading(false);
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
//       setError("Invalid email format!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/users/signUp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: signUpData.name,
//           email: signUpData.email,
//           password: signUpData.password,
//           confirmPassword: signUpData.confirmPassword,
//           phoneNo: signUpData.phoneNo,
//           address: signUpData.address,
//           role: signUpData.role.toLowerCase() // Convert to lowercase for backend
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Reset form and show success
//       setSignUpData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         phoneNo: "",
//         address: "",
//         role: "",
//       });
//       alert('Registration successful! Please sign in.');
//       setRightPanelActive(false); // Switch to sign in panel
//     } catch (err) {
//       setError(err.message);
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleSignInSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
  
//     if (!signInData.email || !signInData.password || !signInData.role) {
//       setError("All fields are required!");
//       setIsLoading(false);
//       return;
//     }
  
//     try {
//       // Login logic
//       const response=await axios.post('http://localhost:3000/api/users/login', 
//         {
//           email: signInData.email,
//           password: signInData.password,

//           role: signInData.role.toLowerCase()
//         },
//         { withCredentials: true }
//       );
      
//       localStorage.setItem("userdata",JSON.stringify(response.data.data));
//       console.log("Response 1",response.data);
//       console.log("response 2",response.data.data);
  
//       // Decide where to redirect based on role
//       let redirect = "/";
//       switch (signInData.role.toLowerCase()) {
//         case "admin":
//           redirect = "/adminAnalytics";
//           break;
//         case "seller":
//           redirect = "/analytics";
//           break;
//         case "buyer":
//           redirect = "/rentalAgreements";
//           break;
//         default:
//           redirect = "/";
//       }
  
//       // After successful login, navigate
//       navigate(redirect);
  
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || err.message || 'Login failed');
//       alert(err.response?.data?.message || err.message || 'Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // // Handle Sign In
//   // const handleSignInSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);
//   //   setError("");

//   //   if (!signInData.email || !signInData.password || !signInData.role) {
//   //     setError("All fields are required!");
//   //     setIsLoading(false);
//   //     return;
//   //   }

//   //   try {
      

//   //     const response = await fetch('http://localhost:3000/api/users/login', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       credentials: 'include', // Important for cookies
//   //       body: JSON.stringify({
//   //         email: signInData.email,
//   //         password: signInData.password,
//   //         role: signInData.role.toLowerCase() // Convert to lowercase for backend
//   //       }),
//   //     });

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       throw new Error(data.message || 'Login failed');
//   //     }

//   //     // Redirect based on role
//   //     switch(signInData.role.toLowerCase()) {
//   //       case "admin":
//   //         navigate("/adminAnalytics");
//   //         break;
//   //       case "seller":
//   //         navigate("/seller-dashboard");
//   //         break;
//   //       case "buyer":
//   //         navigate("/buyer-dashboard");
//   //         break;
//   //       default:
//   //         navigate("/");
//   //     }
//   //   } catch (err) {
//   //     setError(err.message);
//   //     alert(err.message);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSignUpChange = (e) => {
//     setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSignInChange = (e) => {
//     setSignInData({ ...signInData, [e.target.name]: e.target.value });
//     setError("");
//   };

//   return (
//     <div className={`sign_container ${rightPanelActive ? "right-panel-active" : ""}`} id="container">
//       {/* Sign Up Form */}
//       <div className="form-container sign-up-container">
//         <form onSubmit={handleSignUpSubmit}>
//           <h1>Create Account</h1>
//           {error && <div className="error-message">{error}</div>}
//           <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" />
//           <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" />
//           <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" />
//           <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" />
//           <input type="tel" name="phoneNo" value={signUpData.phoneNo} onChange={handleSignUpChange} placeholder="Phone Number" />
//           <input type="text" name="address" value={signUpData.address} onChange={handleSignUpChange} placeholder="Address" />
//           <select className="styled-dropdown" name="role" value={signUpData.role} onChange={handleSignUpChange}>
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>
//           <button type="submit" className="sign_button" disabled={isLoading}>
//             {isLoading ? "Processing..." : "Sign Up"}
//           </button>
//         </form>
//       </div>

//       {/* Sign In Form */}
//       <div className="form-container sign-in-container">
//         <form onSubmit={handleSignInSubmit}>
//           <h1>Sign In</h1>
//           {error && <div className="error-message">{error}</div>}
//           <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" />
//           <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" />
//           <Link to="/forgot-password">Forgot your password?</Link>
//           <select className="styled-dropdown" name="role" value={signInData.role} onChange={handleSignInChange}>
//             <option value="">Select Your Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Seller">Seller</option>
//             <option value="Buyer">Buyer</option>
//           </select>
//           <button type="submit" className="sign_button" disabled={isLoading}>
//             {isLoading ? "Processing..." : "Sign In"}
//           </button>
//         </form>
//       </div>

//       {/* Overlay Panel */}
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome to the Future of Computing!</h1>
//             <h4>Join us and unlock access to the best PC <br /> parts and components for all your building and upgrading needs.</h4>
//             <p>Already have an account?</p>

//             <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Welcome Back to Your PC Parts Store!</h1>
//             <h4>Log in to access your account and continue shopping <br /> for the latest and greatest in PC components.</h4>
//             <p>New here? Start your journey with us.</p>
//             <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState, useEffect } from "react";
import { Navigate, Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthProvider';

import "./signUp.css";

const SignIn = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { user, login } = useAuth();
  const [redirectTo, setRedirectTo] = useState(null);
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    address: "",
    role: "",
  });

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    role: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    if (user) {
      setRedirectTo('/dashboard');
    }
  }, [user]);

  // Handle Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!signUpData.name || !signUpData.email || !signUpData.password || 
        !signUpData.confirmPassword || !signUpData.phoneNo || !signUpData.address || !signUpData.role) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      setError("Invalid email format!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
          confirmPassword: signUpData.confirmPassword,
          phoneNo: signUpData.phoneNo,
          address: signUpData.address,
          role: signUpData.role.toLowerCase() // Convert to lowercase for backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Reset form and show success
      setSignUpData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNo: "",
        address: "",
        role: "",
      });
      alert('Registration successful! Please sign in.');
      setRightPanelActive(false); // Switch to sign in panel
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    if (!signInData.email || !signInData.password || !signInData.role) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }
  
    try {
      // Use the login function from AuthContext
      await login(
        signInData.email,
        signInData.password,
        signInData.role
      );
      
      // The useEffect above will handle redirection once user state updates
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Login failed');
      alert(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
    setError("");
  };

  // Immediate navigation when redirectTo is set
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className={`sign_container ${rightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          {error && <div className="error-message">{error}</div>}
          <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" />
          <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" />
          <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" />
          <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" />
          <input type="tel" name="phoneNo" value={signUpData.phoneNo} onChange={handleSignUpChange} placeholder="Phone Number" />
          <input type="text" name="address" value={signUpData.address} onChange={handleSignUpChange} placeholder="Address" />
          <select className="styled-dropdown" name="role" value={signUpData.role} onChange={handleSignUpChange}>
            <option value="">Select Your Role</option>
            <option value="Admin">Admin</option>
            <option value="Seller">Seller</option>
            <option value="Buyer">Buyer</option>
          </select>
          <button type="submit" className="sign_button" disabled={isLoading}>
            {isLoading ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          {error && <div className="error-message">{error}</div>}
          <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" />
          <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" />
          <Link to="/forgot-password">Forgot your password?</Link>
          <select className="styled-dropdown" name="role" value={signInData.role} onChange={handleSignInChange}>
            <option value="">Select Your Role</option>
            <option value="Admin">Admin</option>
            <option value="Seller">Seller</option>
            <option value="Buyer">Buyer</option>
          </select>
          <button type="submit" className="sign_button" disabled={isLoading}>
            {isLoading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Overlay Panel */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome to the Future of Computing!</h1>
            <h4>Join us and unlock access to the best PC <br /> parts and components for all your building and upgrading needs.</h4>
            <p>Already have an account?</p>

            <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Welcome Back to Your PC Parts Store!</h1>
            <h4>Log in to access your account and continue shopping <br /> for the latest and greatest in PC components.</h4>
            <p>New here? Start your journey with us.</p>
            <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;