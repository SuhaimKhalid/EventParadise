import { Button, Container } from "react-bootstrap";
import { AppContext } from "../../Utilities/AppContext";
import { useContext, useEffect, useState } from "react";
import React from "react";

interface Payment {
  payment_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: string;
  created_at: string;
}
interface Props {
  setShowPayments: React.Dispatch<React.SetStateAction<boolean>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}
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
import { FetchUserPayements, getJoinedEventsByMember } from "../../Api's/api";
export const Member_UserAccountBar: React.FC<Props> = ({
  setShowPayments,
  setPayments,
}) => {
  const { selectedUser, token } = useContext(AppContext);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    const LoadEvents = async () => {
      if (!selectedUser || !token) return;

      try {
        const { events } = await getJoinedEventsByMember(selectedUser.user_id);

        setAllEvents(events);
        console.log(events);
      } catch (error) {
        console.error(error);
      }
    };

    LoadEvents();
  }, [selectedUser, token]);

  const fetchPayments = async (user_id: number) => {
    try {
      const { payments } = await FetchUserPayements(user_id);
      console.log("payments", payments);
      setPayments(payments);
    } catch (err) {
      console.log(err);
    } finally {
      setShowPayments(true);
    }
  };
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
                    <p>Number of Events Joined</p>
                  </div>
                  <div>
                    <Button
                      className="cssbuttons-io"
                      onClick={() => {
                        if (selectedUser?.user_id !== undefined) {
                          fetchPayments(selectedUser.user_id);
                        } else {
                          alert("User not selected or user ID missing");
                        }
                      }}
                    >
                      View Payments
                    </Button>
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
