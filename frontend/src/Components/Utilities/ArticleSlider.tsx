import { useEffect, useState } from "react";
import { fetchAllEvents } from "../Api's/api";
import { Button } from "react-bootstrap";
import { SpinnerSection } from "./SpinnerSection";

// import "../Stlying/slider.css";
export const ArticleSlider = () => {
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
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { events } = await fetchAllEvents();
        setEvents(events);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, []);
  return (
    <>
      <div
        id="carouselEvents"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000" // auto-slide every 3 seconds
      >
        <div className="carousel-inner">
          {!loading ? (
            events.map((item, index) => {
              return (
                <div
                  key={item.event_id}
                  className={`event_slider_card carousel-item ${
                    index === 0 ? "active" : ""
                  }`}
                >
                  <div className="event_card_inner">
                    <div className="event_card_front">
                      <img src={item.image_url} alt={item.title} />
                    </div>
                    <div className="event_card_back">
                      <h4 className="title">{item.title}</h4>
                      <p>
                        Start Date:{" "}
                        {new Date(item.start_date).toLocaleDateString()}
                      </p>
                      <p>
                        End Date: {new Date(item.end_date).toLocaleDateString()}
                      </p>
                      <p className="location">Location: {item.location}</p>
                      <p>Price: {item.price}$</p>
                      <p>Type: {item.type}</p>
                      <Button className="cssbuttons-io">
                        <span>Book Event</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <SpinnerSection />
          )}
        </div>
        {/* Next/Prev Buttons */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselEvents"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselEvents"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};
