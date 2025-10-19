import React from "react";
import { AppContext } from "../../Utilities/AppContext";
import { useContext } from "react";
import { FetchUserPayements, getJoinedEventsByMember } from "../../Api's/api";
import "../../Stlying/Staff_tab_section.css";
interface Payment {
  payment_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: string;
  created_at: string;
}
interface Event {
  event_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: "free" | "paid";
  price: number;
  creator_id: number;
  image_url?: string;
  created_at: string;
}
interface Props {
  setShowPayments: React.Dispatch<React.SetStateAction<boolean>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setJoinedEventLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}
export const StaffAccount_Tabs: React.FC<Props> = ({
  setShowPayments,
  setPayments,
  setJoinedEventLoading,
  setJoinEvents,
}) => {
  const { selectedUser, token } = useContext(AppContext);

  const fetchPayments = async (user_id: number) => {
    try {
      const { payments } = await FetchUserPayements(user_id);
      console.log("payments", payments);
      setPayments(payments);
    } catch (err) {
      console.log(err);
    } finally {
      setShowPayments(true);
    }
  };

  //   Join Event btn
  const fetchJoinEvents = async (user_id: number) => {
    if (!selectedUser || !token) return;
    try {
      const { events } = await getJoinedEventsByMember(user_id);
      setJoinEvents(events);
    } catch (err) {
      console.error(err);
    } finally {
      setJoinedEventLoading(false);
    }
  };

  return (
    <section className="Staff_tab_section">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            href="#home"
            role="tab"
          >
            Created Events
          </a>
        </li>

        <li className="nav-item">
          <a
            onClick={() => {
              if (selectedUser?.user_id !== undefined) {
                fetchJoinEvents(selectedUser.user_id);
              } else {
                alert("User not selected or user ID missing");
              }
            }}
            className="nav-link"
            id="link-tab"
            data-bs-toggle="tab"
            href="#joinedEvents"
            role="tab"
          >
            Joined Events
          </a>
        </li>

        <li className="nav-item">
          <a
            onClick={() => {
              if (selectedUser?.user_id !== undefined) {
                fetchPayments(selectedUser.user_id);
              } else {
                alert("User not selected or user ID missing");
              }
            }}
            className="nav-link"
            id="link-tab"
            data-bs-toggle="tab"
            href="#payments"
            role="tab"
          >
            View Payments
          </a>
        </li>
      </ul>
    </section>
  );
};
