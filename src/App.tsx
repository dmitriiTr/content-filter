import { useState } from "react";
import "./App.css";
import { handleClick } from "./utils/main";

function App() {
  const [posts, setPosts] = useState(0);

  return (
    <>
      <section>
        <input
          type="number"
          onChange={(e) => setPosts(parseInt(e.target.value))}
        />
        <button className="counter" onClick={() => handleClick(posts)}>
          Hide posts with less then {posts} replies
        </button>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
