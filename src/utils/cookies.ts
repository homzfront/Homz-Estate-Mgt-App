"use server";
import { cookies } from "next/headers";

interface StoreTokenRequest {
  token: string;
  refresh_token?: string;
}

export async function storeToken(request: StoreTokenRequest) {
  const isLocalhost = process.env.NODE_ENV === 'development';

  (await cookies()).set({
    name: "accessToken",
    value: request.token,
    httpOnly: true,
    sameSite: "strict",
    secure: !isLocalhost, // don't use secure on localhost (http)
  });

  if (request.refresh_token) {
    (await cookies()).set({
      name: "refreshToken",
      value: request.refresh_token,
      httpOnly: true,
      sameSite: "strict",
      secure: !isLocalhost,
    });
  }
}

export const getToken = async (): Promise<string | undefined> => {
  return (await cookies()).get("accessToken")?.value;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  return (await cookies()).get("refreshToken")?.value;
};

export const deleteToken = async (): Promise<void> => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};