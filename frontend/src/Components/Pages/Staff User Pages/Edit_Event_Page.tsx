import type React from "react";
import { UserAccountBar } from "../../Utilities/UserAccountBar";
import { useEffect, useState, useContext } from "react";
import { fetchSingleEvent } from "../../Api's/api";
import { useParams, useNavigate } from "react-router-dom";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import { AppContext } from "../../Utilities/AppContext";
import axios from "axios";

export const Edit_Event_Page = () => {
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

  const { selectedUser, token } = useContext(AppContext);
  const { event_id } = useParams<{ event_id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Event>({
    event_id: 0,
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    type: "free",
    price: 0,
    creator_id: selectedUser?.user_id || 0,
    image_url: "",
    created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<EventErrors>({});
  const [loading, setLoading] = useState(true);

  // ----------------- Load Single Event -----------------
  useEffect(() => {
    const loadEvent = async () => {
      if (!event_id) return;
      setLoading(true);
      try {
        const { event } = await fetchSingleEvent(Number(event_id));

        // Convert ISO to local datetime format for input fields
        const formatDate = (isoString: string) =>
          isoString ? new Date(isoString).toISOString().slice(0, 16) : "";

        setForm({
          event_id: event.event_id,
          title: event.title,
          description: event.description,
          start_date: formatDate(event.start_date),
          end_date: formatDate(event.end_date),
          location: event.location,
          type: event.type,
          price: event.price,
          creator_id: event.creator_id,
          image_url: event.image_url,
          created_at: event.created_at,
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [event_id]);

  // ----------------- Validation -----------------
  const validateForm = (): EventErrors => {
    const newErrors: EventErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.start_date) newErrors.start_date = "Start date is required.";
    if (!form.end_date) newErrors.end_date = "End date is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.type) newErrors.type = "Type is required.";
    if (form.type === "paid" && (!form.price || form.price <= 0))
      newErrors.price = "Valid price is required for paid events.";
    if (!form.image_url?.trim()) newErrors.image_url = "Image URL is required.";
    return newErrors;
  };

  // ----------------- Handle Change -----------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ----------------- Submit / Update Event -----------------
  const EditEventHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await axios.patch(
        `https://eventparadise.onrender.com/api/events/${event_id}`,
        {
          title: form.title,
          description: form.description,
          start_date: new Date(form.start_date).toISOString(),
          end_date: new Date(form.end_date).toISOString(),
          location: form.location,
          type: form.type,
          price: form.type === "paid" ? Number(form.price) : 0,
          image_url: form.image_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Event updated successfully!");
      navigate("/staff-account");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <>
      {!loading ? (
        <>
          <UserAccountBar />
          <div className="container mt-5">
            <h2 className="mb-4 text-center">Edit Event</h2>

            <form onSubmit={EditEventHandler}>
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Event Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <small className="text-danger">{errors.title}</small>
                )}
              </div>

              {/* Description */}
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

              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Location */}
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

              {/* Type */}
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

              {/* Price (paid events only) */}
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
                    placeholder="Enter ticket price"
                  />
                  {errors.price && (
                    <small className="text-danger">{errors.price}</small>
                  )}
                </div>
              )}

              {/* Image URL */}
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
                  placeholder="Paste image URL"
                />
                {errors.image_url && (
                  <small className="text-danger">{errors.image_url}</small>
                )}
              </div>

              {/* Submit */}
              <div className="text-center">
                <button type="reset" className="btn btn-secondary px-4 py-2">
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 ms-3"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <SpinnerSection />
      )}
    </>
  );
};
