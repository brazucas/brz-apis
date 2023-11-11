import { type APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
  try {
    cookies.delete("authToken", {
      path: "/",
    });
    cookies.delete("authTokenExpiresIn", {
      path: "/",
    });
    cookies.delete("authTokenType", {
      path: "/",
    });
    cookies.delete("refreshToken", {
      path: "/",
    });
    cookies.delete("userInfo", {
      path: "/",
    });

    return redirect("/");
  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      {
        status: 400,
      }
    );
  }
};
