import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { RepositoryContext } from "../shared/contexts";
import { Repository } from "../repositories/Repository";
import { requestLogin } from "../services/ApiServices";
import { TokenRequest } from "../types/data";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../redux/slice/accessSlice";

const enum LoginDivBgColor {
  default = "bg-white",
  hover = "hover:bg-gray",
}
export const Access = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const repository = useContext<Repository>(RepositoryContext);
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const googleToken = response.access_token;
      const localStorage = await repository.getStorage();

      const tokenRequest: TokenRequest = {
        google_token: googleToken,
      };
      const loginResponse = await requestLogin(repository, tokenRequest);
      if (loginResponse) {
        if ("access_token" in loginResponse) {
          localStorage.setAccessToken(loginResponse.access_token);
          dispatch(setAuthToken(loginResponse.access_token));

          localStorage.setRefreshToken(loginResponse.refresh_token);
          navigate("/");
        }
      } else console.error("Could not login");
    },
  });
  return (
    <div className="flex h-[100vh] bg-white">
      <img
        src="/icons/AiBg.png"
        alt="AI Bg"
        className="hidden lg:block lg:w-2/3"
      />
      <div className="flex items-center justify-center w-full lg:w-1/3">
        <div className="flex min-h-[250px] w-[325px] flex-col items-center justify-around">
          <img
            src="/icons/OpenAiPng.svg"
            alt="OpenAi logo"
            className="w-[40px]"
          />
          <div className="flex flex-col min-h-[120px] w-full justify-around items-center">
            <p className="text-center text-xl font-[500]">Welcome</p>
            <div
              onClick={() => googleLogin()}
              className={`${LoginDivBgColor.default} ${LoginDivBgColor.hover} flex cursor-pointer h-[50px] w-full justify-center items-center border border-[#c2c8d0] rounded-md`}
            >
              <img
                src="/icons/Google.svg"
                alt="Google icon"
                className="w-[20px] mx-3"
              />
              <p className="text-sm">Continue with Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
