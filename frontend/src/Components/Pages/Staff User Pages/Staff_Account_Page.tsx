import { Button, Card, Col, Container, Table } from "react-bootstrap";
import { UserAccountBar } from "./UserAccountBar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Utilities/AppContext";

import axios from "axios";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import "../../Stlying/Staff_acount.css";
import { StaffAccount_Tabs } from "./StaffAccount_Tabs";

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
interface Payment {
  payment_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: string;
  created_at: string;
}
export const Staff_Account_Page = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPayments, setShowPayments] = useState(false);

  const { selectedUser, token } = useContext(AppContext);

  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  const [joinedEventLoading, setJoinedEventLoading] = useState(true);
  const [joinEvents, setJoinEvents] = useState<Event[]>([]);

  useEffect(() => {
    const LoadEvents = async () => {
      if (!selectedUser || !token) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://eventparadise.onrender.com/api/users/${selectedUser.user_id}/created-events`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllEvents(response.data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    LoadEvents();
  }, [selectedUser, token]);

  const deleteEventHandle = async (event_id: number) => {
    if (!token) return;

    try {
      await axios.delete(
        `https://eventparadise.onrender.com/api/events/${event_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllEvents((prev) =>
        prev.filter((event) => event.event_id !== event_id)
      );
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const detailEventHandler = (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };

  const editEventHandler = (event_id: number) => {
    window.open(`/edit-event/${event_id}`, "_self");
  };

  const ViewAttendeesHandler = async (event_id: number) => {
    window.open(`/view_attendees/${event_id}`, "_self");
  };

  // For Payment table
  //-----------------------
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
      <UserAccountBar />

      <Container>
        <StaffAccount_Tabs
          setShowPayments={setShowPayments}
          setPayments={setPayments}
          setJoinedEventLoading={setJoinedEventLoading}
          setJoinEvents={setJoinEvents}
        />
        <section className="tab-content mt-3" id="myTabContent">
          {/* Created Events */}
          <div className="tab-pane fade show active" id="home" role="tabpanel">
            <section className="staff_created_event">
              {loading ? (
                <div className="staff_page_spinner">
                  <SpinnerSection />
                </div>
              ) : allEvents.length === 0 ? (
                <h4 style={{ margin: "20px 0px", textAlign: "center" }}>
                  No events created yet.
                </h4>
              ) : (
                allEvents.map((item, index) => (
                  <Col lg={4} md={6} sm={12} key={index}>
                    <Card
                      className="staff_page_card"
                      style={{ width: "18rem" }}
                    >
                      <Card.Img variant="top" src={item.image_url} />
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>Location: {item.location}</Card.Text>
                        <Card.Text>
                          Type: {item.type.toLocaleUpperCase()}
                        </Card.Text>
                        <Card.Text>
                          Start Date:{" "}
                          {new Date(item.start_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </Card.Text>
                        <Card.Text>
                          End Date:{" "}
                          {new Date(item.end_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Card.Text>
                        <div className="staff_Event_btn_div">
                          <Button
                            className="cssbuttons-io"
                            onClick={() => editEventHandler(item.event_id)}
                          >
                            <span>Edit</span>
                          </Button>
                          <Button
                            className="cssbuttons-io"
                            onClick={() => detailEventHandler(item.event_id)}
                          >
                            <span>View</span>
                          </Button>
                        </div>
                        <div className="staff_Event_btn_div">
                          <Button
                            className="cssbuttons-io"
                            onClick={() => deleteEventHandle(item.event_id)}
                          >
                            <span>Delete</span>
                          </Button>
                          <Button
                            className="cssbuttons-io"
                            onClick={() => ViewAttendeesHandler(item.event_id)}
                          >
                            <span> Attendees</span>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </section>
          </div>
          {/* Joined Events */}
          <div className="tab-pane fade" role="tabepanel" id="joinedEvents">
            <section className="staff_created_event">
              {joinedEventLoading ? (
                <div className="staff_page_spinner">
                  <SpinnerSection />
                </div>
              ) : joinEvents.length === 0 ? (
                <h4 style={{ margin: "20px 0px", textAlign: "center" }}>
                  No events joined yet.
                </h4>
              ) : (
                joinEvents.map((item, index) => (
                  <Col lg={4} md={6} sm={12} key={index}>
                    <Card
                      className="staff_page_card"
                      style={{ width: "18rem" }}
                    >
                      <Card.Img variant="top" src={item.image_url} />
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>Location: {item.location}</Card.Text>
                        <Card.Text>
                          Type: {item.type.toLocaleUpperCase()}
                        </Card.Text>
                        <Card.Text>
                          Start Date:{" "}
                          {new Date(item.start_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </Card.Text>
                        <Card.Text>
                          End Date:{" "}
                          {new Date(item.end_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Card.Text>

                        <Button
                          className="cssbuttons-io"
                          onClick={() => detailEventHandler(item.event_id)}
                        >
                          <span>View</span>
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </section>
          </div>
          {/* View Payments */}
          <div className="tab-pane fade" id="payments" role="tabpanel">
            <section id="payments" className="Payment_table">
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
                          {new Date(item.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
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
                <SpinnerSection />
              )}
            </section>
          </div>
        </section>
      </Container>
    </>
  );
};
