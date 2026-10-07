import dotenv from "dotenv"
dotenv.config()
import Razorpay from "razorpay"

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.log("⚠️  Razorpay keys not configured - running in test/mock payment mode");
}

export default razorpay