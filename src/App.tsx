import { useEffect, useState } from "react";
import "./App.css";
import { STORAGE_KEY, type Data } from "./utils/constants";

function App() {
  const [posts, setPosts] = useState(0);
  const [hideForwarded, setHideForwarded] = useState(false);

  const onHidePosts = () => {
    chrome.storage.sync.set({
      [STORAGE_KEY]: {
        postsNumber: posts,
        hideForwarded,
      },
    });

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "FILTER_POSTS",
          hideForwarded: hideForwarded,
          postsNumber: posts,
        });
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY).then(({ data }) => {
      setPosts((data as Data).postsNumber);
      setHideForwarded((data as Data).hideForwarded);
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
        <input
          type="checkbox"
          checked={hideForwarded}
          onChange={() => setHideForwarded((val) => !val)}
        />
        <button className="counter" onClick={() => onHidePosts()}>
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
