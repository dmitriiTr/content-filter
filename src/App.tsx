import { useEffect, useState } from "react";
import "./App.css";
import { handleClick, STORAGE_KEY } from "./utils/main";
import type { Data } from "./utils/contentScripts";

function App() {
  const [posts, setPosts] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY).then(({ data }) => {
      console.log(data);
      setPosts((data as Data).postsNumber);
    });
  }, []);

  return (
    <>
      <section>
        <input
          type="number"
          value={posts}
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
