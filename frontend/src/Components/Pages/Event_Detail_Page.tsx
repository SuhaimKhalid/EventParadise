import { useContext, useEffect, useState } from "react";
import { fetchSingleEvent } from "../Api's/api";
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { AppContext } from "../Utilities/AppContext";
import axios from "axios";

export const Event_Detail_Page = () => {
  const { event_id } = useParams<{ event_id: string }>();
  const { token, selectedUser } = useContext(AppContext);

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

  const [singleEvent, setSingleEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      if (!event_id) return alert("No Event Id is given");

      try {
        setLoading(true);
        const { event } = await fetchSingleEvent(Number(event_id));
        setSingleEvent(event);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [event_id]);

  const handlePayment = async (
    event_id: number,
    amount: number,
    token: string,
    user_id: number
  ) => {
    if (!token) return alert("You must be logged in!");

    console.log("token:", token);
    console.log("Event_id", event_id);
    console.log("User_id", user_id);

    try {
      const res = await axios.post(
        `https://eventparadise.onrender.com/api/payments/create`,
        { user_id, event_id, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Payment Response:", res.data);

      // Stripe Checkout URL from backend
      const checkoutUrl = res.data.checkout_url;

      // redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Payment failed:", err.response?.data);
      } else {
        console.error(err);
      }
    }
  };

  const bookEventHandler = async (event_id: number) => {
    if (!token) return window.open("/login", "_self");

    try {
      await axios.post(
        `https://eventparadise.onrender.com/api/events/${event_id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event has been added to your profile!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          alert("You are already registered for this event.");
        } else {
          alert("Something went wrong while registering.");
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!singleEvent) return <p>No event found.</p>;

  return (
    <section className="Event_details">
      <h2>Event Details</h2>
      <img
        src={singleEvent.image_url || "/default-event.jpg"}
        alt={singleEvent.title}
      />

      <Container>
        <section className="event_detail_box">
          <article className="left_side col-lg-9 col-sm-12">
            <p>{singleEvent.description}</p>
          </article>

          <article className="right_side col-lg-3 col-sm-12">
            <h4 className="title">{singleEvent.title}</h4>
            <p>
              Start Date:{" "}
              {new Date(singleEvent.start_date).toLocaleDateString()}
            </p>
            <p>
              End Date: {new Date(singleEvent.end_date).toLocaleDateString()}
            </p>
            <p className="location">Location: {singleEvent.location}</p>
            <p>Type: {singleEvent.type}</p>
            <p>Price: £{singleEvent.price}</p>

            {/* Pay button */}
            {singleEvent.type === "paid" && token && selectedUser && (
              <button
                className="payBtn"
                onClick={() =>
                  handlePayment(
                    singleEvent.event_id,
                    singleEvent.price,
                    token,
                    selectedUser.user_id
                  )
                }
              >
                Pay £{singleEvent.price}
              </button>
            )}

            {/* Book button */}
            <Button
              className="cssbuttons-io"
              onClick={() => bookEventHandler(singleEvent.event_id)}
            >
              Book Event
            </Button>
          </article>
        </section>
      </Container>
    </section>
  );
};
