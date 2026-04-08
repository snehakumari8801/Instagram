import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { token } = useParams();

  console.log(token);

  async function onSubmit(data) {
    // console.log(data)
    try {
      let res = await axios.post(
        `http://localhost:8000/api/v1/user/resetPassword/${token}`,
        { password: data.password }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center h-[100vh]"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-blue-500 font-bold text-4xl">RESET PASSWORD</h1>
        <label className="text-2xl">Password</label>
        <input
          type="password"
          placeholder="xyz@gmail.com"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Min 6 character",
            },
          })}
          className="h-10 border border-gray-300 px-2"
        />
        {/* {errors.password && <div>{errors.password.message}</div>} */}
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ResetPassword;
