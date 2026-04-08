import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    console.log(data);
    try{
      const response = await axios.get("http://localhost:8000/api/v1/user/forgotPassword",{
        params:{email:data.email}
      });
      let token = response.data?.token;
       console.log(response.data?.success )
      if(response.data?.success){
        navigate(`/resetPassword/${token}`)
      }
    }catch(error){
        console.log(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center h-[100vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <input
        className="text-center w-[200px] border-2 border-blue-600 h-10 mt-3"
          type="email"
          placeholder="xyz@gmail.com"
          {...register("email", {
            required: "Email is reqired",
            patter: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid Formate",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}{" "}
      </div>

      <button onSubmit={handleSubmit} className="mt-2 h-8 bg-blue-600 w-20 text-amber-50">Submit</button>
    </form>
  );
}

export default ForgotPassword;
