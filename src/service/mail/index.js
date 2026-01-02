const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = async (email, otp) => {
    const message = {
        from: '"Task Management" <no-reply@task-management>',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`,
        html: `
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: auto"}}>
                <h2>Verifikasi Email</h2>
                <p>Kode OTP Anda:</p>
                <h1 style={{fontSize: "40px", fontWeight: "bold", letterSpacing: "10px", border: "1px solid blue", border-radius: "10px", padding: "10px"}}>${otp}</h1>
                <small>Berlaku 2 menit</small>
            </div>
        `,
    };

    await transporter.sendMail(message);
};

module.exports = { sendMail };
