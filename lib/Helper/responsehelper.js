import { NextResponse } from "next/server";

export const response = (success, status, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    {
      status: status,
    }
  );
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
