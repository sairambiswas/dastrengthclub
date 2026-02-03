import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Admin disabled permanently
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
