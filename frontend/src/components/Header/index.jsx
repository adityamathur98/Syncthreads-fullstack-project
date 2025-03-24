import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove("token");
    navigate("/api/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link to="/api/dashboard">
        <img
          className="w-18"
          src="https://files.oaiusercontent.com/file-HBTpvRq1j347fXKoNs9KkY?se=2025-03-24T07%3A13%3A12Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dba25c0bb-a71f-4842-8798-2255d2c1f8a5.webp&sig=Qx2Uct/2tJmGVX8jKHBIPnl1p2TU2VrjX7OvWPwB4%2Bs%3D"
          alt="website logo"
        />
      </Link>

      <button
        className="font-roboto font-semibold text-sm px-4 py-2 text-white bg-blue-700 rounded cursor-pointer"
        onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Header;
