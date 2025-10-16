import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../Utilities/AppContext";

interface Payment {
  payment_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { token } = useContext(AppContext);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const payment_id = searchParams.get("payment_id");

  useEffect(() => {
    if (!payment_id) {
      setError("No payment ID found in URL");
      setLoading(false);
      return;
    }

    const fetchPayment = async () => {
      if (!token) {
        setError("You must be logged in to view payment details");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch the current payment status first
        const resBefore = await axios.get(
          `https://eventparadise.onrender.com/api/payments/${payment_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const currentPayment: Payment = resBefore.data.payment;

        // 2️⃣ Only update to 'success' if it's still pending
        if (currentPayment.status === "pending") {
          await axios.patch(
            `https://eventparadise.onrender.com/api/payments/${payment_id}`,
            { status: "success" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // 3️⃣ Fetch updated payment details
        const res = await axios.get(
          `https://eventparadise.onrender.com/api/payments/${payment_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPayment(res.data.payment);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.msg || "Payment fetch/update failed");
        } else {
          setError("Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [payment_id, token]);

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!payment) return <p>No payment information available.</p>;

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Payment ID: {payment.payment_id}</p>
      <p>Event ID: {payment.event_id}</p>
      <p>Amount Paid: £{payment.amount}</p>
      <p>Status: {payment.status}</p>
      <p>Payment Time: {new Date(payment.created_at).toLocaleString()}</p>
    </div>
  );
};
