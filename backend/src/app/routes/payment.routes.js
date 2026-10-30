import {Router} from 'express'
import productModel from '../models/product.model.js';
import razorpayInstance from '../config/razorpay.js';
import config from '../config/config.js';
import paymentModel  from '../models/payment.model.js';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';

const router = Router();



// console.log(config.RAZORPAY_KEY_SECRET)


// console.log("Secret:", Boolean(config.RAZORPAY_KEY_SECRET));
// console.log("Secret type:", typeof config.RAZORPAY_KEY_SECRET);
// console.log("Secret length:", config.RAZORPAY_KEY_SECRET?.length);

// console.log("Config object:", Object.keys(config));


router.post("/:productId/order", async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const order = await razorpayInstance.orders.create({
            amount: Math.round(product.price.amount * 100),
            currency: product.price.currency,
            receipt: `order_rcptid_${productId}`,
            notes: {
                productId: productId,
                productTitle: product.title
            }
        });

        await paymentModel.create({
            orderId: order.id,
            product: productId,
            amount: product.price.amount,
            currency: product.price.currency,
            status: "pending"
        });

        return res.status(201).json({
            keyId: razorpayInstance.key_id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error("Order creation error:", error);

        return res.status(500).json({
            message: "Failed to create payment order"
        });
    }
});




router.post("/verify", async (req, res) => {

    const { orderId, paymentId, signature } = req.body

    const payment = await paymentModel.findOne({
        orderId: orderId,
        status: "pending"
    })

    if (!payment) {
        return res.status(404).json({ message: "Payment not found or already verified" });
    }

    const isValid = validatePaymentVerification({
        order_id: orderId,
        payment_id: paymentId,
    }, signature, config.RAZORPAY_KEY_SECRET)

    if (!isValid) {
        return res.status(400).json({ message: "Invalid payment verification" });
    }

    await paymentModel.updateOne(
        { orderId: orderId },
        { $set: { status: "completed", paymentId: paymentId, signature: signature } }
    )

    /**
     * Update the payment status to "completed" and store the paymentId and signature.
     * write extra logic here if needed, such as notifying the user or updating related records.
     */


    return res.status(200).json({ message: "Payment verified successfully" });
})




export default router;