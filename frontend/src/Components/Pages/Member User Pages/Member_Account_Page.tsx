import { useEffect, useState, useContext } from "react";
import { Member_UserAccountBar } from "./Member_UserAccountBar";
import { Button, Card, Col, Container } from "react-bootstrap";
import { AppContext } from "../../Utilities/AppContext";
import { getJoinedEventsByMember } from "../../Api's/api";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
export const Member_Account_Page = () => {
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
  const [loading, setLoading] = useState(true);
  const { selectedUser, token } = useContext(AppContext);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  useEffect(() => {
    const loadFunction = async () => {
      if (!selectedUser || !token) return;
      try {
        const { events } = await getJoinedEventsByMember(selectedUser.user_id);

        setAllEvents(events);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadFunction();
  }, []);

  //   See Detai of Event
  const detailEventHandler = (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };
  return (
    <>
      <Member_UserAccountBar />

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
                      onClick={() => detailEventHandler(item.event_id)}
                    >
                      <span>Detail</span>
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
