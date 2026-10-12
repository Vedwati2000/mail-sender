const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
      origin: "http://localhost:5173"

}));
app.use(express.json());

console.log("Email configured:", Boolean(process.env.EMAIL_USER));
console.log("Password configured:", Boolean(process.env.EMAIL_PASS));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error) => {
    if (error) {
        console.error("Email connection failed:", error.message);
    } else {
        console.log("Email server is ready!");
    }
});

app.post("/send-email", async (req, res) => {
    const { email } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to my application",
            text: "Hello! Welcome to my application. Your registration was successful."
        });

        return res.status(200).json({
            message: "Email sent successfully"
        });

    } catch (error) {
        console.error("Email sending failed:", error.message);

        return res.status(500).json({
            message: "Failed to send email"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});