import "./App.css";
import "./index.css";
import "./Components/Stlying/slider.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route } from "react-router-dom";

import { NavbarComponent } from "./Components/Utilities/NavbarComponent";
import { Event_Page } from "./Components/Pages/Events_Page";
import { Home_Page } from "./Components/Pages/Main Pages/Home_Page";
import { Register_Staff_Page } from "./Components/Pages/Main Pages/Register_Staff_Page";
import { Login_User_Page } from "./Components/Pages/Main Pages/Login_User_Page";
import { Event_Detail_Page } from "./Components/Pages/Event_Detail_Page";
import { Add_Event_Page } from "./Components/Pages/Staff User Pages/Add_Event_Page";
import { Staff_Account_Page } from "./Components/Pages/Staff_Account_Page";
import { AppProvider } from "./Components/Utilities/AppProvider";
import { Edit_Event_Page } from "./Components/Pages/Staff User Pages/Edit_Event_Page";
import { Member_Account_Page } from "./Components/Pages/Member User Pages/Member_Account_Page";
import { View_Attendees } from "./Components/Pages/Staff User Pages/View_Attendees";
import { PaymentSuccessPage } from "./Components/Pages/Payment_Success_Page";
import { Footer } from "./Components/Utilities/footer";

function App() {
  return (
    <AppProvider>
      <NavbarComponent />
      <main>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/events" element={<Event_Page />} />
          <Route
            path="/event-details/:event_id"
            element={<Event_Detail_Page />}
          />
          <Route path="/register" element={<Register_Staff_Page />} />
          <Route path="/login" element={<Login_User_Page />} />

          {/* Staff */}
          <Route path="/staff_account" element={<Staff_Account_Page />} />
          <Route path="/edit-event/:event_id" element={<Edit_Event_Page />} />
          <Route path="/add-event" element={<Add_Event_Page />} />
          <Route
            path="/view_attendees/:event_id"
            element={<View_Attendees />}
          />

          {/* Member Routes */}
          <Route path="/member_account" element={<Member_Account_Page />} />

          {/* Payment */}
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </AppProvider>
  );
}

export default App;
