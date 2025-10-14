import { useContext, useEffect, useState } from "react";
import { fetchSingleEvent } from "../Api's/api";
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { AppContext } from "../Utilities/AppContext";
import axios from "axios";
export const Event_Detail_Page = () => {
  const { event_id } = useParams<{ event_id: string }>();

  const { token } = useContext(AppContext);
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
  const [singleEvent, setSingleEvent] = useState<Event>();
  useEffect(() => {
    const loadEvent = async () => {
      if (event_id) {
        try {
          const { event } = await fetchSingleEvent(Number(event_id));
          setSingleEvent(event);
          console.log("Single Event:", event);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          console.log("Fetch Successfull");
        }
      } else {
        console.log("No Event Id is given");
      }
    };
    loadEvent();
  }, []);

  // ----------------------
  // Book Event
  const bookEventHandler = async (event_id: number) => {
    if (token) {
      try {
        await axios.post(
          `https://eventparadise.onrender.com/api/events/${event_id}/register`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Event has been added to your profile!");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 400) {
            alert("You are already registered for this event.");
          } else {
            alert("Something went wrong while registering for the event.");
          }
        } else {
          console.error("Unexpected error:", err);
        }
      }
    } else {
      window.open("/login", "_self");
    }
  };

  return (
    <>
      <section className="Event_details">
        <h2>Event Details</h2>
        {singleEvent ? (
          <>
            <img src={singleEvent.image_url} alt={singleEvent.title} />

            <Container>
              <section className="event_detail_box ">
                <article className="left_side col-lg-9 col-sm-12">
                  <p>{singleEvent.description}</p>
                </article>
                <article className="right_side col-lg-3 col-sm-12">
                  <h4 className="title">{singleEvent.title}</h4>
                  <p>
                    Start Date:{" "}
                    {new Date(singleEvent.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    End Date:{" "}
                    {new Date(singleEvent.end_date).toLocaleDateString()}
                  </p>
                  <p className="location">Location: {singleEvent.location}</p>
                  <p>Price: {singleEvent.price}$</p>
                  <p>Type: {singleEvent.type}</p>
                  <Button
                    className="cssbuttons-io"
                    onClick={() => bookEventHandler(singleEvent.event_id)}
                  >
                    <span>Book Event</span>
                  </Button>
                </article>
              </section>
            </Container>
          </>
        ) : (
          <p>There is no Event To Display</p>
        )}
      </section>
    </>
  );
};
