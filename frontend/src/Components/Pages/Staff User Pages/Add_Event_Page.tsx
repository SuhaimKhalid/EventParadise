import { useState, useContext } from "react";
import { AppContext } from "../../Utilities/AppContext";
import { UserAccountBar } from "./UserAccountBar";
import { MovieSearch } from "../../Api's/movieApi";
import axios from "axios";
import { Col } from "react-bootstrap";
import "../../Stlying/addEvent.css";

export const Add_Event_Page = () => {
  interface Event {
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

  type EventErrors = {
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    type?: string;
    price?: string;
    image_url?: string;
  };

  interface Movie {
    title: string;
    overview: string;
    poster_path?: string;
  }

  const { selectedUser, token } = useContext(AppContext);

  const [form, setForm] = useState<Event>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    type: "free",
    price: 1, // minimum valid value
    creator_id: selectedUser?.user_id || 0,
    image_url: "",
    created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<EventErrors>({});
  const [movieQuery, setMovieQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // special logic for price input
    if (name === "price") {
      const numberValue = Number(value);
      if (numberValue < 1 || isNaN(numberValue)) {
        setForm({ ...form, price: 1 }); // enforce min 1
      } else {
        setForm({ ...form, price: Math.floor(numberValue) }); // only integers
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleMovieSearch = async (query: string) => {
    setMovieQuery(query);
    if (!query.trim()) return;

    const movie = await MovieSearch(query);
    if (movie) handleMovieSelect(movie);
  };

  const handleMovieSelect = (movie: Movie) => {
    setForm({
      ...form,
      title: movie.title,
      description: movie.overview,
      image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    });
  };

  const validateForm = (): EventErrors => {
    const newErrors: EventErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.start_date) newErrors.start_date = "Start date is required.";
    if (!form.end_date) newErrors.end_date = "End date is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.type) newErrors.type = "Type is required.";
    if (form.type === "paid" && (!form.price || form.price < 1))
      newErrors.price = "Price must be a positive integer starting from 1.";
    if (!form.image_url?.trim()) newErrors.image_url = "Image URL is required.";
    return newErrors;
  };

  const AddEventHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://eventparadise.onrender.com/api/events",
        { ...form, creator_id: selectedUser?.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Event created successfully!");
      console.log("Created Event:", response.data.event);

      setForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        type: "free",
        price: 1,
        creator_id: selectedUser?.user_id || 0,
        image_url: "",
        created_at: new Date().toISOString(),
      });
      setMovieQuery("");
    } catch (err: unknown) {
      console.error(err);
      alert("❌ Failed to create event. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <UserAccountBar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Create New Event</h2>
        <section className="AddEvent_section">
          <Col lg={3} md={3} sm={12}>
            <div className="createEventInfoSide">
              <h4>How to Create an Event</h4>
              <ul>
                <li>In the search bar, type the name of any movie.</li>
                <li>
                  Our movie API will automatically fill in the movie’s
                  description, poster image, and other details.
                </li>
                <li>
                  You don’t need to write the description or add an image URL
                  manually.
                </li>
                <li>Just enter your event location.</li>
                <li>Add the start and end date/time for your event.</li>
                <li>
                  Choose whether your event is Free or Paid, based on your
                  preference.
                </li>
                <li>
                  Finally, click <strong>Create Event</strong> — and your event
                  will be ready to go!
                </li>
              </ul>
            </div>
          </Col>

          <Col lg={9} md={9} sm={12} className="add_event_form_col">
            <div className="add_eventForm">
              <div className="mb-3 add_searchMoviediv">
                <label className="form-label">Search Movie</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type movie name"
                  value={movieQuery}
                  onChange={(e) => handleMovieSearch(e.target.value)}
                />
              </div>

              <form onSubmit={AddEventHandler}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Movie Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter movie or event title"
                  />
                  {errors.title && (
                    <small className="text-danger">{errors.title}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control"
                    id="description"
                    rows={3}
                    placeholder="Enter event details"
                  />
                  {errors.description && (
                    <small className="text-danger">{errors.description}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="start_date" className="form-label">
                    Start Date
                  </label>
                  <input
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    type="datetime-local"
                    className="form-control"
                    id="start_date"
                  />
                  {errors.start_date && (
                    <small className="text-danger">{errors.start_date}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">
                    End Date
                  </label>
                  <input
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    type="datetime-local"
                    className="form-control"
                    id="end_date"
                  />
                  {errors.end_date && (
                    <small className="text-danger">{errors.end_date}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="Event location"
                  />
                  {errors.location && (
                    <small className="text-danger">{errors.location}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="form-select"
                    id="type"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                  {errors.type && (
                    <small className="text-danger">{errors.type}</small>
                  )}
                </div>

                {form.type === "paid" && (
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price (£)
                    </label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="number"
                      className="form-control"
                      id="price"
                      min={1}
                      step={1}
                      placeholder="Enter ticket price (1 or higher)"
                    />
                    {errors.price && (
                      <small className="text-danger">{errors.price}</small>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="image_url" className="form-label">
                    Poster / Image URL
                  </label>
                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id="image_url"
                    placeholder="Paste movie poster or event image URL"
                  />
                  {errors.image_url && (
                    <small className="text-danger">{errors.image_url}</small>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn add_event_submitBtn"
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </section>
      </div>
    </>
  );
};
