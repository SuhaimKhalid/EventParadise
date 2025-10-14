import { useEffect, useState } from "react";
import { fetchAllEvents } from "../Api's/api";
import { Button } from "react-bootstrap";
import { SpinnerSection } from "./SpinnerSection";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

export const ArticleSlider = () => {
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

  if (loading) return <SpinnerSection />;

  return (
    <div
      id="carouselEvents"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000" // auto-slide every 3 seconds
    >
      <div className="carousel-inner">
        {events.map((item, index) => (
          <div
            key={item.event_id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={
                item.image_url ||
                "https://placehold.jp/416871/ffffff/300x400.png"
              }
              className="d-block w-100"
              alt={item.title}
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
              <h5>{item.title}</h5>
              <p>{item.location}</p>
              <p>
                {new Date(item.start_date).toLocaleDateString()} -{" "}
                {new Date(item.end_date).toLocaleDateString()}
              </p>
              <p>
                Price: {item.price}$ | Type: {item.type}
              </p>
              <Button className="btn btn-primary">Book Event</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Next/Prev Buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselEvents"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselEvents"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
