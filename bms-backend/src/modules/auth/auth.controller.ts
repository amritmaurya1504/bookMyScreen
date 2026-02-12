import { Request, Response, NextFunction } from "express";
import * as OtpService from "./otp.service";
import * as UserService from "../user/user.service";
import * as TokenService from "./token.service";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";


export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { email } = req.body;

        if(!email){
            const err = new createHttpError.BadRequest("Email is required");
            return next(err);
        }

        if(!isValidEmail(email)){
            const err = new createHttpError.BadRequest("Invalid email format");
            return next(err);
        }

        // 1. Create OTP;
        const otp = OtpService.generateOTP();

        // 2. Hash OTP with email;
        const ttl = 1000 * 60 * 2; // 2 mins;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = OtpService.hashOTP(data);

        // 3. Send OTP to user's email;
        try {
            await OtpService.sendOTPtoEmail(email, otp);
        } catch (error) {
            console.log(error);
            const err = new createHttpError.InternalServerError("Error sending OTP to email");
            return next(err);
        }

        // 4. Respond to the client;
        res.json({
            hash: `${hashedOTP}.${expires}`,
            email, msg: "OTP sent to email successfully ✅"
        })

    } catch (error) {
        next(error);
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, hash } = req.body;

    if(!email || !otp || !hash){
        const err = new createHttpError.BadRequest("All fields are required");
        return next(err);
    }

    // 1. OTP Verification;
    const [hashedOTP, expires] = hash.split(".");
    if(Date.now() > +expires){
        const err = new createHttpError.Gone("OTP Expired");
        return next(err);
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOTP, data);

    if(!isValid){
        const err = new createHttpError.Unauthorized("Invalid OTP");
        return next(err);
    }

    // 2. Find or Create a new user;
    console.log(isValid);
    let user;
    try {
        user = await UserService.getUserByEmail(email);
        if(!user){
            console.log("inside")
            user = await UserService.createUser({email});
        }
    } catch (error) {
        return next(error);
    }

    // 3. Generate JWT;
    const { accessToken, refreshToken } = TokenService.generateToken(
        { _id: user._id, email: user.email }
    );

    // 4. Store refresh token in DB;
    await TokenService.storeRefreshToken(user._id as string, refreshToken);

    // 5 sending token in cookie
    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })

    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })

    res.json({auth: true, user});

}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        // delete refresh token from db
        await TokenService.deleteRefreshToken(refreshToken);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({msg: "Logged out successfully"}).status(200);

    } catch (error) {
        next(error);
    }
}