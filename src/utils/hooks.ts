import { useCallback, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [captchaToken, setCaptchToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      return;
    }
    try {
      const token = await executeRecaptcha("yourAction");
      if (token) {
        setCaptchToken(token);
      } else {
        setCaptchaError("Captcha failed");
      }
      return token;
    } catch (err) {
      console.error(err);
      setCaptchaError("Captcha failed");
    }
    // setCaptchToken(token);
  }, [executeRecaptcha]);

  return {
    captchaReady: executeRecaptcha,
    captchaToken,
    captchaError,
    handleReCaptchaVerify,
  };
};
