import {jwtDecode} from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const userType = query.get("userType");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decoded));

        if (userType === "researcher") {
          navigate("/researcher/dashboard");
        } else if (userType === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Token decode failed:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center text-xl font-semibold">
      Verifying your account...
    </div>
  );
}

export default AuthSuccess;
