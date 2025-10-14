import { Button, Card, Col, Container } from "react-bootstrap";
import { UserAccountBar } from "../Utilities/UserAccountBar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Utilities/AppContext";

import axios from "axios";
import { SpinnerSection } from "../Utilities/SpinnerSection";
export const Staff_Account_Page = () => {
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

  const { selectedUser, token } = useContext(AppContext);

  const [allEvents, setAllEvents] = useState<Event[]>([]);

  console.log("token", token);
  console.log("SelectedUser", selectedUser);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <UserAccountBar />

      <Container>
        <section className="staff_created_event">
          {loading ? (
            <SpinnerSection />
          ) : allEvents.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            allEvents.map((item, index) => (
              <Col lg={4} md={6} sm={12} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img variant="top" src={item.image_url} />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>Location: {item.location}</Card.Text>
                    <Card.Text>Type: {item.type.toLocaleUpperCase()}</Card.Text>
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
                      <span>Detail</span>
                    </Button>
                    <Button
                      className="cssbuttons-io"
                      onClick={() => deleteEventHandle(item.event_id)}
                    >
                      <span>Delete</span>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </section>
      </Container>
    </>
  );
};
