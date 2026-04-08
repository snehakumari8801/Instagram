import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCalendar, FiCamera, FiArrowRight } from "react-icons/fi";

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const imageFile = watch("profilePic");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (imageFile && imageFile[0]) {
            const file = imageFile[0];
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [imageFile]);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("age", data.age);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("profilePic", data.profilePic[0]);

        try {
            const res = await fetch(`http://localhost:8000/api/v1/user/register`, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (result.success) {
                navigate(`/login`);
            }
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-blue-100 text-sm">Join our community today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" encType="multipart/form-data">
                    {/* Profile Picture Upload */}
                    <div className="text-center mb-4">
                        <div className="relative inline-block">
                            <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <FiCamera className="text-gray-400 text-2xl" />
                                )}
                            </div>
                            <label htmlFor="profilePic" className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                <FiCamera size={14} />
                                <input
                                    id="profilePic"
                                    type="file"
                                    accept="image/*"
                                    {...register("profilePic", {
                                        required: "Profile picture is required",
                                    })}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.profilePic && (
                            <p className="text-red-500 text-xs mt-2">{errors.profilePic.message}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                {...register("name", { 
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" }
                                })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                                    errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                                }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="number"
                                placeholder="Enter your age"
                                {...register("age", {
                                    required: "Age is required",
                                    min: { value: 1, message: "Must be at least 1" },
                                    max: { value: 120, message: "Please enter a valid age" }
                                })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                                    errors.age ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                                }`}
                            />
                        </div>
                        {errors.age && (
                            <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                                    errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                                }`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center ${
                            loading 
                                ? "bg-blue-400 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account <FiArrowRight className="ml-2" />
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                        >
                            Sign in here
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}