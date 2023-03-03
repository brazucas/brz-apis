import axios from "axios";

export const checkRecaptchaChallenge = async (token: string) => {
    const recaptchaCheck = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        {},
        {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
            secret: process.env.RECAPTCHA_SECRET,
            response: token,
        },
        }
    );

    const recaptchaCheckJson = await recaptchaCheck.data;

    return recaptchaCheckJson.success;
}