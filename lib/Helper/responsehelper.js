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
