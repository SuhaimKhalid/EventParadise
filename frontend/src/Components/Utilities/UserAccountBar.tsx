import { Container } from "react-bootstrap";
import { AppContext } from "../Utilities/AppContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
export const UserAccountBar = () => {
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
  const { selectedUser, token } = useContext(AppContext);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    const LoadEvents = async () => {
      if (!selectedUser || !token) return;

      try {
        const response = await axios.get(
          `https://eventparadise.onrender.com/api/users/${selectedUser.user_id}/created-events`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllEvents(response.data.events);
      } catch (error) {
        console.error(error);
      }
    };

    LoadEvents();
  }, [selectedUser, token]);

  return (
    <>
      <section className="userAccountBar">
        <div className="userAccountBarBlock">
          <Container>
            <div className="userInner">
              <div className="userInnerBar">
                <div className="userName_div">
                  <h3>{selectedUser?.name.charAt(0)}</h3>
                </div>
                <div className="userInfo_div">
                  <div className="InnerUserInfo_up">
                    <h4>{selectedUser?.name}</h4>
                    {selectedUser && (
                      <p>
                        Register Since{" "}
                        {new Date(selectedUser.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <div className="InnerUserInfo_down">
                    <div>
                      <h4>{allEvents.length}</h4>
                    </div>
                    <p>Number of Events Created</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
};
