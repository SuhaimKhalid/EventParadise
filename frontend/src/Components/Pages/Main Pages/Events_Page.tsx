import { useEffect, useState } from "react";
import { fetchAllEvents } from "../../Api's/api";
import posterImage from "../../../assets/Images/Upcoming Posters/pxfuel.jpg";
import { Button, Col, Container } from "react-bootstrap";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import "../../Stlying/event_articles.css";

export const Event_Page = () => {
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
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async (): Promise<void> => {
      try {
        const { events } = await fetchAllEvents();
        setAllEvents(events);
        console.log("All Events:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        console.log("Fetch Successful");
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const getEvent = (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };

  return (
    <section className="Event_page">
      <img src={posterImage} alt="Movie Poster" className="main_poster_image" />

      <section className="EventPage_inner">
        <Container>
          <h3 className="event_page_tite">Events</h3>
          <p className="text-center">
            Discover all the exciting events happening soon! Browse upcoming
            activities, view event details, and find the perfect one to join.
          </p>

          {loading ? (
            <SpinnerSection />
          ) : (
            <article className="row events_article">
              {allEvents.map((item, index) => (
                <Col key={index} lg={4} md={6} sm={12}>
                  <div className="event_box" style={{ width: "18rem" }}>
                    <img src={item.image_url} alt={item.title} />
                    <div className="event_info_box">
                      <h4>{item.title}</h4>
                      <p>
                        Start Date:{" "}
                        {new Date(item.start_date).toLocaleDateString()}
                      </p>
                      <p>
                        End Date: {new Date(item.end_date).toLocaleDateString()}
                      </p>
                      <p>Location: {item.location}</p>
                      <Button
                        onClick={() => getEvent(item.event_id)}
                        className="view_event_btn"
                      >
                        View Event
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </article>
          )}
        </Container>
      </section>
    </section>
  );
};
