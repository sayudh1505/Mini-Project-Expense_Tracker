// rrd imports
import { Outlet } from "react-router-dom";

// assets
import wave from "../assets/wave.svg";

// components
import Nav from "../components/Nav";

// context
import { useAuth } from "../context/AuthContext";

const Main = () => {
  const { currentUser } = useAuth();

  return (
    <div className="layout">
      <Nav user={currentUser} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};

export default Main;