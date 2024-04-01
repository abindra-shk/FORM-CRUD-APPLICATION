import { Routes, Route } from "react-router-dom";
import { Home } from "../layouts/home";
import { Profile } from "../layouts/profile";
const MainRoute = () => {
    return (
      <Routes>
        <Route path={"/"} element={<Home/>} />
        <Route path={"/profile"} element={<Profile/>}/>
      </Routes>
    );
  };
  
export default MainRoute;
  