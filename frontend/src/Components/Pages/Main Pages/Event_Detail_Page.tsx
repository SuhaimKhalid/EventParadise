import { useContext, useEffect, useState } from "react";
import { fetchSingleEvent } from "../../Api's/api";
import { useParams } from "react-router-dom";
import { Button, Col, Container } from "react-bootstrap";
import { AppContext } from "../../Utilities/AppContext";
import axios from "axios";
import "../../Stlying/event_detail.css";

export const Event_Detail_Page = () => {
  const { event_id } = useParams<{ event_id: string }>();
  const { token, selectedUser } = useContext(AppContext);
  const [bookingLoading, setBookingLoading] = useState(false);
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

  const bookEventHandler = async (
    event_id: number,
    amount: number,
    token: string,
    user_id: number,
    type: string
  ) => {
    if (!token) return window.open("/login", "_self");

    try {
      setBookingLoading(true); // disable the button
      await axios.post(
        `https://eventparadise.onrender.com/api/events/${event_id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === "paid") {
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
        } finally {
          setBookingLoading(false);
        }
      }

      alert("Event has been added to your profile!");
      window.open("/", "_self");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          alert("You are already registered for this event.");
        } else {
          alert("Something went wrong while registering. Refresh The Page");
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
      <Container>
        <section className="event_detail_inner">
          <Col lg={4} md={4} col={12}>
            <div className="event_detail_img_box">
              <div className="imgBox">
                <img
                  src={singleEvent.image_url || "/default-event.jpg"}
                  alt={singleEvent.title}
                />
              </div>
            </div>
          </Col>
          <Col lg={8} md={8} sm={12}>
            <div className="event_detail_info">
              <h4 className="title">Title: {singleEvent.title}</h4>
              <p>
                <b>Description:</b> {singleEvent.description}
              </p>

              <div className="event_info_box">
                <p>
                  Start Date:{" "}
                  {new Date(singleEvent.start_date).toLocaleDateString()}
                </p>
                <p>
                  End Date:{" "}
                  {new Date(singleEvent.end_date).toLocaleDateString()}
                </p>
                <p className="location">Location: {singleEvent.location}</p>
                <p>Type: {singleEvent.type}</p>
                {singleEvent.type === "paid" && (
                  <p>Price: £{singleEvent.price}</p>
                )}
              </div>
              <div className="book_btn_div">
                {token && selectedUser ? (
                  <Button
                    className="bookbtn"
                    disabled={bookingLoading} // disable when loading
                    style={{
                      opacity: bookingLoading ? 0.6 : 1,
                      pointerEvents: bookingLoading ? "none" : "auto",
                    }}
                    onClick={() =>
                      bookEventHandler(
                        singleEvent.event_id,
                        singleEvent.price,
                        token,
                        selectedUser.user_id,
                        singleEvent.type
                      )
                    }
                  >
                    <span> {bookingLoading ? "Booking..." : "Book Event"}</span>
                  </Button>
                ) : (
                  <div className="bootbtn_div_login">
                    <p>To Book an Event you need to Login First.</p>
                    <Button
                      className="bookbtn"
                      onClick={() => window.open("/login", "_self")}
                    >
                      <span> Login</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </section>

        <section className="event_detail_box d-none">
          <article className="right_side col-lg-3 col-sm-12">
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
          </article>
        </section>
      </Container>
    </section>
  );
};
