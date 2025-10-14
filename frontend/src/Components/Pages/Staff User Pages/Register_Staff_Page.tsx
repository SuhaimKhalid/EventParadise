import { useState } from "react";
import { ArticleSlider } from "../../Utilities/ArticleSlider";
import { postUserAsStaff } from "../../Api's/api";
import { useNavigate } from "react-router-dom";
import "../../Stlying/Login&register.css";
export const Register_Staff_Page = () => {
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"staff" | "member" | "">("");

  // field-specific errors
  const [errors, setErrors] = useState<RegisterErrors>({});

  type RegisterErrors = {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  // function to get current ISO date for created_at
  const getCurrentDate = () => new Date().toISOString();

  const validateForm = (): RegisterErrors => {
    const newErrors: RegisterErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!role.trim()) newErrors.role = "Role is required.";

    return newErrors;
  };

  const UserRegisterHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    // stop submission if any errors
    if (Object.keys(newErrors).length > 0) return;

    // build final user object
    const userData = {
      name,
      email,
      password,
      role: role as "staff" | "member",
      created_at: getCurrentDate(),
    };

    try {
      const { user } = await postUserAsStaff(userData);
      console.log("Registered user:", user);
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setErrors({ email: "Registration failed. Please try again." });
    }
  };

  return (
    <section className="signIN_Off">
      <article className="event_slides col-lg-6 col-sm-12">
        <ArticleSlider />
      </article>

      <article className="event_form col-lg-6 col-sm-12">
        <form onSubmit={UserRegisterHandler}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              User Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="userName"
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>
          {/* Email */}
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
          {/* Password */}
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
          {/* Role */}
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select
              aria-label="Select Role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as "staff" | "member")}
            >
              <option value="">--Select Role--</option>
              <option value="staff">Staff</option>
              <option value="member">Member</option>
            </select>
            {errors.role && (
              <small className="text-danger">{errors.role}</small>
            )}
          </div>
          <div className="btn_box">
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open("/login", "_self");
              }}
              className="btn RegisterStaff_btn"
            >
              <span> Login</span>
            </button>
            <button type="submit" className="btn RegisterStaff_btn">
              <span> Register</span>
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};
