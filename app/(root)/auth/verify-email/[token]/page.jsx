"use client";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import verifiedImg from "@/public/assets/images/verified.gif";
import verifiedFailed from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";

const EmailVerification = ({ params }) => {
  const [isVerified, setIsVerified] = useState(false);
  const { token } = use(params);
  console.log("Token:", token);
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post(
        "/api/auth/verify-email",
        { token }
      );
      console.log("verificationResponse", verificationResponse);
      if (verificationResponse.success) {
        setIsVerified(true);
      } else {
        console.error("Verification failed:", verificationResponse.message);
      }
    };
    verify();
  }, [token]);
  return (
    <Card className={"w-[400px]"}>
      <CardContent>
        {isVerified ? (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={verifiedImg.src}
                height={verifiedImg.height}
                width={verifiedImg.width}
                alt="verified-gif"
                className="h-[100px] w-auto "
              />
            </div>
            <div className="text-center">
              <h1 className="text-center text-2xl font-bold text-green-600 my-5">
                Email Verified Successfully!
              </h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={verifiedFailed.src}
                height={verifiedFailed.height}
                width={verifiedFailed.width}
                alt="verified-gif"
                className="h-[100px] w-auto "
              />
            </div>
            <div className="text-center">
              <h1 className="text-center text-2xl font-bold text-red-600 my-5">
                Email Verified Failed!
              </h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
