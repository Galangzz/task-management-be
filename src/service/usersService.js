const redis = require('../service/redis/CacheService');
const mailSender = require('../service/mail');

const InvariantError = require('../exceptions/InvariantError');

const OTP_TTL = 300; // 5 menit
const RESEND_TTL = 600; // 10 menit
const COOLDOWN_TTL = 60; // 60 detik
const MAX_RESEND = 3;
const MAX_ATTEMPT = 5;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

function _getKeys(email) {
    return {
        otpKey: `otp:signup:${email}`,
        resendKey: `otp:resend:${email}`,
        cooldownKey: `otp:cooldown:${email}`,
        signupKey: `signup:data:${email}`,
    };
}

async function sendOTP(email) {
    const { otpKey, resendKey, cooldownKey } = _getKeys(email);

    if (await redis.exists(cooldownKey)) {
        throw new InvariantError('Tunggu sebelum resend OTP', 429);
    }

    const resend = JSON.parse((await redis.get(resendKey)) || '{"count":0}');
    if (resend.count >= MAX_RESEND) {
        throw new InvariantError('Terlalu banyak request cobalah beberapa saat lagi', 429);
    }

    const otp = generateOTP();
    console.log({ otp });

    await redis.set(otpKey, JSON.stringify({ otp, attempt: 0 }), OTP_TTL);

    await redis.set(resendKey, JSON.stringify({ count: resend.count + 1 }), RESEND_TTL);

    await redis.set(cooldownKey, '1', COOLDOWN_TTL);

    await mailSender.sendMail(email, otp);
}

async function verifyOTP(email, inputOTP) {
    const { otpKey, resendKey } = _getKeys(email);

    const data = await redis.get(otpKey);
    if (!data) {
        throw new InvariantError('OTP sudah kadaluarsa', 410);
    }

    const parsed = JSON.parse(data);

    if (parsed.attempt >= MAX_ATTEMPT) {
        await redis.del(otpKey);
        throw new InvariantError('Terlalu banyak percobaan OTP', 423);
    }

    if (parsed.otp !== inputOTP) {
        parsed.attempt += 1;
        await redis.set(otpKey, JSON.stringify(parsed));
        throw new InvariantError('OTP tidak valid');
    }

    await redis.del(otpKey);
    await redis.del(resendKey);
}

async function saveUserData({ username, email, password }) {
    const { signupKey } = _getKeys(email);

    const data = {
        username,
        email,
        password,
    };

    await redis.set(signupKey, JSON.stringify(data), 600);
}

async function getUserData(email) {
    const { signupKey } = _getKeys(email);

    const data = await redis.get(signupKey);

    return JSON.parse(data);
}

async function deleteUserData(email) {
    const { signupKey } = _getKeys(email);

    await redis.del(signupKey);
}

module.exports = { sendOTP, verifyOTP, saveUserData, getUserData, deleteUserData };
