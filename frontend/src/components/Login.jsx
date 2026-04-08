import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { io } from "socket.io-client";


const socket = io("http://localhost:8000", {
  withCredentials: true,
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log("User registered on socket:", result.user._id);
        socket.emit("register", result.user._id);
        navigate('/home');
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <Link to='/forgotPassword'>
            <button type="button" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </button>
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium text-white text-sm transition-colors ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
            <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            GitHub
          </button>
          <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
            <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          New here?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}







// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// // import {register , onSubmit }

// export default function Login() {
//   const schema = yup.object().shape({
//     email: yup
//       .string()
//       .email("Invalid Email formate")
//       .required("Email is required"),

//     password: yup
//       .string()
//       .required("Password is required")
//       .min(6, "Password must be atleast 6 characters")
//       .matches(/[A-Z]/, "Must include an uppercase letter")
//       .matches(/[a-z]/, "Must include a lowercase letter")
//       .matches(/\d/, "Must Include a number"),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   async function onSubmit(data) {
//     console.log("Data Successfully!", data);
//     try{
//       let res = await fetch('http://localhost:5000/api/v1/user/login',{
//         method:"POST",
//         headers:{
//          "Content-Type":"application/json"
//         },
//         body:JSON.stringify(data)
//       })

//       const result = await res.json()
//     }catch(error){
//       console.log(error)
//     }

//   }
//   return (
//     <div className="color:'bg-red-500' flex flex-col justify-center items-center mt-6">
//       <div className="text-center">Login</div>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* <div>
//         <input {...register("email")} placeholder="Enter your Email"/>
//         {error.email && <p style="color:red">{error.email.message}</p>}
//         </div> */}

//         {/* Email Field */}
//         <div>
//           <input {...register("email")} placeholder="Enter your email" />
//           {errors.email && (
//             <p style={{ color: "red" }}>{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <input {...register("password")} placeholder="Enter Your Password" />
//           {errors.password && (
//             <p style={{ color: "red" }}>{errors.password.message}</p>
//           )}
//         </div>

//         <button type="submit">submit</button>
//       </form>
//     </div>
//   );
// }
