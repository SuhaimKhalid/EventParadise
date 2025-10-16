import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../Utilities/AppContext";
import { SpinnerSection } from "../Utilities/SpinnerSection";

interface Payment {
  payment_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export const Home_Page = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useContext(AppContext);

  const [tokenReady, setTokenReady] = useState(false);

  // 🧠 Step 1: Wait until token is restored from context/localStorage
  useEffect(() => {
    if (token !== undefined && token !== null) {
      setTokenReady(true);
    }
  }, [token]);

  // 🧾 Step 2: Only run payment logic when tokenReady === true
  useEffect(() => {
    if (!tokenReady) return;

    const success = searchParams.get("payment_success");
    const payment_id = searchParams.get("payment_id");

    if (!success || !payment_id) return;

    const updatePayment = async () => {
      setLoading(true);
      try {
        const resBefore = await axios.get(
          `https://eventparadise.onrender.com/api/payments/${payment_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const currentPayment: Payment = resBefore.data.payment;

        if (success === "true" && currentPayment.status === "pending") {
          await axios.patch(
            `https://eventparadise.onrender.com/api/payments/${payment_id}`,
            { status: "success" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("✅ Payment successful!");
        } else if (success === "false") {
          alert("❌ Payment was cancelled.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.msg || "Payment update failed.");
        } else {
          alert("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
        setSearchParams({});
      }
    };

    updatePayment();
  }, [tokenReady, searchParams, token, setSearchParams]);

  return (
    <>
      {loading ? (
        <SpinnerSection />
      ) : (
        <h1 className="text-center mt-8">This is the Landing Page</h1>
      )}
    </>
  );
};
