import { useState, useContext } from "react";
import { ArticleSlider } from "../Utilities/ArticleSlider";
import { loginPostUser } from "../Api's/api";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Utilities/AppContext";
import "../Stlying/Login&register.css";

export const Login_User_Page: React.FC = () => {
  const navigate = useNavigate();
  const { setUserAccess, setSelectedUser, setToken } = useContext(AppContext);

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
      console.log("whole user", user);

      const userInfo = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };

      // Save in localStorage
      localStorage.setItem("Login", JSON.stringify({ user: userInfo, token }));

      // Update context
      setSelectedUser(userInfo);
      setToken(token);
      setUserAccess(true);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({ email: "Login failed. Please try again." });
    }
  };

  return (
    <section className="signIN_Off">
      <article className="event_slides col-lg-6 col-sm-12">
        <ArticleSlider />
      </article>

      <article className="event_form col-lg-6 col-sm-12">
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
                window.open("/register-staff", "_self");
              }}
              className="btn RegisterStaff_btn"
            >
              <span> Register</span>
            </button>
            <button type="submit" className="btn RegisterStaff_btn">
              <span> Login</span>
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};
