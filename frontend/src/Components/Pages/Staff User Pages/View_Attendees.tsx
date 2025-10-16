import { useContext, useEffect, useState } from "react";
import { UserAccountBar } from "../../Utilities/UserAccountBar";
import { AppContext } from "../../Utilities/AppContext";
import axios from "axios";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import { fetchSingleEvent } from "../../Api's/api";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Table } from "react-bootstrap";
export const View_Attendees = () => {
  const { event_id } = useParams<{ event_id: string }>();
  const { token } = useContext(AppContext);
  interface User {
    user_id: number;
    name: string;
    email: string;
    password: string;
    role: "staff" | "member";
    joined_at: string;
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
  const [attendes, setAttendes] = useState<User[]>([]);

  const [viewEvent, setViewEvent] = useState<Event>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadEvent = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://eventparadise.onrender.com/api/events/${event_id}/attendees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { event } = await fetchSingleEvent(Number(event_id));

        setViewEvent(event);
        setAttendes(response.data.attendees);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [token, event_id]); // ✅ only runs when token or event_id changes

  const detailEventHandler = async (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };
  const editEventHandler = (event_id: number) => {
    window.open(`/edit-event/${event_id}`, "_self");
  };
  return (
    <>
      <UserAccountBar />
      {loading ? (
        <SpinnerSection />
      ) : viewEvent ? (
        <section className="view_attendees_section">
          <Col lg={4} md={6} sm={12}>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={viewEvent.image_url} />
              <Card.Body>
                <Card.Title>{viewEvent.title}</Card.Title>
                <Card.Text>Location: {viewEvent.location}</Card.Text>
                <Card.Text>
                  Type: {viewEvent.type.toLocaleUpperCase()}
                </Card.Text>
                <Card.Text>
                  Start Date:{" "}
                  {new Date(viewEvent.start_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Card.Text>
                <Card.Text>
                  End Date:{" "}
                  {new Date(viewEvent.end_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Card.Text>

                <Button
                  className="cssbuttons-io"
                  onClick={() => detailEventHandler(viewEvent.event_id)}
                >
                  <span>View Event</span>
                </Button>

                <Button
                  className="cssbuttons-io"
                  onClick={() => editEventHandler(viewEvent.event_id)}
                >
                  <span>Edit Event</span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {attendes.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {new Date(user.joined_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </section>
      ) : (
        <SpinnerSection />
      )}
    </>
  );
};
