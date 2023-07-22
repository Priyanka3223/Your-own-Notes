import React, { useContext } from "react";
import Notes from "./Notes.js"
const Home = (props) => {
  return (
    <div>
      <Notes showalert={props.showalert}/>
    </div>
  );
};

export default Home;
