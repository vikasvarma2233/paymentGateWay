
import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const productId = "6ae2ee1647ab25498bf6f24a";

  const payNow = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Step 1: Create order from backend
      const response = await axios.post(
        `/api/payments/${productId}/order`
      );

      const data = response.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Kapda Co.",
        description: "Product Payment",
        order_id: data.orderId,

        // Step 3: Verify payment
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axios.post(
              "/api/payments/verify",
              {
                orderId: paymentResponse.razorpay_order_id,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
              }
            );

            setMessage(verifyResponse.data.message);
          } catch (error) {
            setMessage(
              error.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setMessage("Payment window closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (error) {
        setMessage(error.error.description || "Payment failed");
        setLoading(false);
      });

      razorpay.open();

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Unable to create payment order"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Kapda Co.
        </h1>

        <p className="mb-6 text-gray-500">
          Secure online payment
        </p>

        <div className="rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Payment
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Complete your purchase using Razorpay.
          </p>
        </div>

        <button
          onClick={payNow}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default Payment;
