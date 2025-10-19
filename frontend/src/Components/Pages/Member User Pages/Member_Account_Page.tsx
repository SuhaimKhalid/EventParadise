// Member_Account_Page.tsx
import { useEffect, useState, useContext } from "react";
import { Member_UserAccountBar } from "./Member_UserAccountBar";
import { Button, Card, Col, Container, Table } from "react-bootstrap";
import { AppContext } from "../../Utilities/AppContext";
import { getJoinedEventsByMember } from "../../Api's/api";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import axios from "axios";
import { getGoogleCalendarLink } from "../../Utilities/GoogleCalender";

import "../../Stlying/member_account_page.css";
// import { useGoogleCalendar } from "../../Utilities/GoogleCalender";

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

export const Member_Account_Page = () => {
  // const { addEventToCalendar, gapiReady } = useGoogleCalendar();
  const [loading, setLoading] = useState(true);
  const { selectedUser, token } = useContext(AppContext);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const loadFunction = async () => {
      if (!selectedUser || !token) return;
      try {
        const { events } = await getJoinedEventsByMember(selectedUser.user_id);
        setAllEvents(events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFunction();
  }, [selectedUser, token]);

  const detailEventHandler = (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };

  const eventName = (event_id: number) => {
    const event = allEvents.find((e) => e.event_id === event_id);
    return event ? event.title : "Unknown Event";
  };

  const handlePayment = async (payment: Payment) => {
    if (!token) return alert("You must be logged in!");
    try {
      const res = await axios.post(
        `https://eventparadise.onrender.com/api/payments/create`,
        {
          user_id: payment.user_id,
          event_id: payment.event_id,
          amount: payment.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = res.data.checkout_url;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Payment failed:", err.response?.data);
        alert(err.response?.data?.msg || "Payment failed");
      } else {
        console.error(err);
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Member_UserAccountBar
        setShowPayments={setShowPayments}
        setPayments={setPayments}
      />

      <Container>
        {showPayments ? (
          <Table
            style={{ marginTop: "20px" }}
            striped
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                <th>Movie Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, index) => (
                <tr key={index}>
                  <td>{eventName(item.event_id)}</td>
                  <td>{item.amount}</td>
                  <td>{item.status}</td>
                  <td>
                    {new Date(item.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    {item.status === "success" ? (
                      <span>Paid</span>
                    ) : (
                      token && (
                        <Button
                          className="TablepayBtn"
                          onClick={() => handlePayment(item)}
                        >
                          <span>Pay</span>
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <section className="staff_created_event member_page">
            {loading ? (
              <SpinnerSection />
            ) : allEvents.length === 0 ? (
              <p>No events joined yet.</p>
            ) : (
              allEvents.map((item, index) => (
                <Col lg={4} md={6} sm={12} key={index}>
                  <Card className="member_col_div" style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={item.image_url} />
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>Location: {item.location}</Card.Text>
                      <Card.Text>Type: {item.type.toUpperCase()}</Card.Text>
                      <Card.Text>
                        Start Date:{" "}
                        {new Date(item.start_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Card.Text>
                      <Card.Text>
                        End Date:{" "}
                        {new Date(item.end_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Card.Text>

                      <div className="btn_div">
                        <Button
                          className="cssbuttons-io"
                          onClick={() => detailEventHandler(item.event_id)}
                        >
                          <span>View Detail</span>
                        </Button>

                        <Button className="cssbuttons-io">
                          <span>
                            <a
                              className="addCalender"
                              href={getGoogleCalendarLink(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Add to Calendar
                            </a>
                          </span>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </section>
        )}
      </Container>
    </>
  );
};
