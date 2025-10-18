import { useState, useContext, useEffect } from "react";
import { ArticleSlider } from "../../Utilities/ArticleSlider";
import { fetchAllEvents, loginPostUser } from "../../Api's/api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Utilities/AppContext";
import "../../Stlying/Login&register.css";
import { SpinnerSection } from "../../Utilities/SpinnerSection";
import { Container } from "react-bootstrap";

export const Login_User_Page: React.FC = () => {
  const navigate = useNavigate();
  const { setUserAccess, setSelectedUser, setToken } = useContext(AppContext);

  const [loadLogin, setLoadLogin] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  type LoginErrors = {
    email?: string;
    password?: string;
  };

  const validateForm = (): LoginErrors => {
    const newErrors: LoginErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  const UserLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const { user, token } = await loginPostUser({ email, password });

      const userInfo = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };

      localStorage.setItem("Login", JSON.stringify({ user: userInfo, token }));

      setSelectedUser(userInfo);
      setToken(token);
      setUserAccess(true);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({ email: "Login failed. Please try again." });
    }
  };
  useEffect(() => {
    const loadEvent = async () => {
      try {
        await fetchAllEvents();
      } finally {
        setLoadLogin(false);
      }
    };
    loadEvent();
  });

  return (
    <>
      <Container>
        {loadLogin ? (
          <section style={{ marginTop: "70px" }}>
            <SpinnerSection />
          </section>
        ) : (
          <section className="signIN_Off d-flex flex-wrap">
            <article className="event_slides col-lg-4 col-md-4 col-sm-12">
              <ArticleSlider />
            </article>
            <article className="event_form col-lg-8 col-md-8 col-sm-12">
              <h3>Login</h3>
              <p className="text-center">
                Welcome back! Please log in to continue.
              </p>
              <form onSubmit={UserLoginHandler}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
                    id="email"
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                    id="password"
                  />
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </div>

                <div className="btn_box">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("/register", "_self");
                    }}
                    className="btn RegisterStaff_btn"
                  >
                    <span>Register</span>
                  </button>
                  <button type="submit" className="btn RegisterStaff_btn">
                    <span>Login</span>
                  </button>
                </div>
              </form>
            </article>
          </section>
        )}
      </Container>
    </>
  );
};
