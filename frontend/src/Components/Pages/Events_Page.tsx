import { useEffect, useState } from "react";
import { fetchAllEvents } from "../Api's/api";
import posterImage from "../../assets/Images/Upcoming Posters/pxfuel.jpg";
import { Button, Container } from "react-bootstrap";
import { SpinnerSection } from "../Utilities/SpinnerSection";
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
        console.log("All Event:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        console.log("Fetch Successfull");
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const getEvent = (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };
  return (
    <>
      <section className="Event_page">
        <img
          src={posterImage}
          alt="Movie Poster"
          className="main_poster_image"
        />
        <section className="EventPage_inner">
          <Container>
            <h3 className="event_page_tite">Events</h3>
            {loading ? (
              <SpinnerSection />
            ) : (
              allEvents.map((item, index) => {
                return (
                  <article className="row events_article" key={index}>
                    <div className="col-lg-8 col-sm-12 image_box">
                      <img src={item.image_url} alt={item.title} />
                    </div>
                    <div className="col-lg-4 col-sm-12 event_info_box">
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
                  </article>
                );
              })
            )}
          </Container>
        </section>
      </section>
    </>
  );
};
