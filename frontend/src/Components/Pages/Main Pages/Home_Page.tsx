import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../Utilities/AppContext";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import heroImage from "../../../assets/Images/Upcoming Posters/cover 2.jpg";
import "../../Stlying/home_page.css";
import { Button, Col, Container } from "react-bootstrap";
import { Home_Event_Image_Sider } from "../../Utilities/Home_Event_Image_Sider";
import Form from "react-bootstrap/Form";
import { fetchAllEvents } from "../../Api's/api";
import { Footer } from "../../Utilities/footer";
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

export const Home_Page = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useContext(AppContext);

  const [tokenReady, setTokenReady] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  // 🧠 Step 1: Wait until token is restored from context/localStorage
  useEffect(() => {
    if (token !== undefined && token !== null) {
      setTokenReady(true);
    }
  }, [token]);

  // 🧾 Step 2: Only run payment logic when tokenReady === true
  useEffect(() => {
    if (!tokenReady) return;

    const success = searchParams.get("payment_success");
    const payment_id = searchParams.get("payment_id");

    if (!success || !payment_id) return;

    const updatePayment = async () => {
      setLoading(true);
      try {
        const resBefore = await axios.get(
          `https://eventparadise.onrender.com/api/payments/${payment_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const currentPayment: Payment = resBefore.data.payment;

        if (success === "true" && currentPayment.status === "pending") {
          await axios.patch(
            `https://eventparadise.onrender.com/api/payments/${payment_id}`,
            { status: "success" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("✅ Payment successful!");
        } else if (success === "false") {
          alert("❌ Payment was cancelled.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.msg || "Payment update failed.");
        } else {
          alert("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
        setSearchParams({});
      }
    };

    updatePayment();
  }, [tokenReady, searchParams, token, setSearchParams]);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { events } = await fetchAllEvents();
        setAllEvents(events);
        console.log(events);
      } catch (err) {
        console.log(err);
      }
    };
    loadEvent();
  }, []);
  const formhandler = async (event_id: number) => {
    window.open(`/event-details/${event_id}`, "_self");
  };
  return (
    <>
      {loading ? (
        <SpinnerSection />
      ) : (
        <section className="home">
          {/* Hero section */}
          <section className="hero_image_section">
            <img
              src={heroImage}
              alt="Upcoming Movie Event Poster"
              className="heroImage"
            />
          </section>
          <Container>
            {/* Search Section */}
            <section className="search_event_section">
              <Col lg={8} md={8} sm={12} className="search_box">
                <h3>Search your event</h3>
                <p>
                  Select your event from the list below and book your spot
                  instantly.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedTitle) {
                      formhandler(Number(selectedTitle));
                    } else {
                      alert("Please select an event first!");
                    }
                  }}
                >
                  <div className="mb-3">
                    <div className="input_bar">
                      <Form.Select
                        className="select_input"
                        aria-label="Find Your Event From List"
                        value={selectedTitle || ""}
                        onChange={(e) => setSelectedTitle(e.target.value)}
                      >
                        <option value="" disabled>
                          --Select Event By Title--
                        </option>
                        {allEvents.map((item) => {
                          const formattedDate = new Date(
                            item.start_date
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });

                          return (
                            <option key={item.event_id} value={item.event_id}>
                              {`${item.title} | ${item.location} | ${formattedDate}`}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Button type="submit" className="searchBtn">
                        <span> Search</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Col>
              <Col lg={4} md={4} sm={0} className="home_slider">
                <Home_Event_Image_Sider />
              </Col>
            </section>
            {/* About */}
            <section className="about_section">
              <h4>About Platform</h4>
              <p>
                Our platform makes it easy for local movie businesses and
                organizers to create and share movie events with the community.
                Staff users can quickly create events for upcoming or past
                movies, set event details, and choose whether the event is free
                or paid. Community members can browse events, sign up, and even
                add them directly to their Google Calendar for easy tracking.
                The platform is designed to make hosting and attending movie
                events smooth and seamless, giving organizers full control and
                members a simple way to join their favorite movie experiences.
              </p>
            </section>
            {/* Staff Section */}
            <section className="staff_section">
              <Col lg={3} md={12} sm={12} className="staff_Icon_div">
                <p>Staff</p>
              </Col>
              <Col lg={9} md={12} sm={12} className="staff_info_div">
                <ul>
                  <li>
                    <b> Take charge of your events:</b> Become a staff member
                    and gain full control over creating and managing your
                    events.
                  </li>
                  <li>
                    <b>Create and host with ease:</b> Set up event details,
                    schedules, and locations quickly and efficiently.
                  </li>
                  <li>
                    <b>Manage attendees effortlessly:</b> Track registrations,
                    monitor attendance, and communicate updates directly with
                    participants.{" "}
                  </li>
                  <li>
                    <b>Ensure smooth execution:</b> Keep event information
                    accurate, respond to participant queries, and maintain an
                    organized experience.
                  </li>
                  <li>
                    <b>Access powerful tools:</b> Enjoy a complete suite of
                    features that help you run successful, engaging, and
                    memorable events.
                  </li>

                  <button
                    className="staffBtn"
                    onClick={() => window.open("register", "_self")}
                  >
                    Become a Staff Member
                  </button>
                </ul>
              </Col>
            </section>
            {/* Member Section */}
            <section className="member_section">
              <Col
                lg={3}
                md={12}
                sm={12}
                className="member_Icon_div top_member"
              >
                <p>Member</p>
              </Col>
              <Col lg={9} md={12} sm={12} className="member_info_div">
                <ul>
                  <li>
                    <b>Discover events:</b> Browse and find events that match
                    your interests, whether free or paid.
                  </li>
                  <li>
                    <b>Join easily:</b> Register and secure your spot at any
                    event with just a few clicks.
                  </li>
                  <li>
                    <b> Track your participation:</b> Keep a record of all your
                    events and make the most of every experience.
                  </li>

                  <button
                    className="memberBtn"
                    onClick={() => window.open("register", "_self")}
                  >
                    Become a Member
                  </button>
                </ul>
              </Col>
              <Col
                lg={3}
                md={12}
                sm={12}
                className="member_Icon_div bottom_member"
              >
                <p>Member</p>
              </Col>
            </section>
          </Container>
          <Footer />
        </section>
      )}
    </>
  );
};
