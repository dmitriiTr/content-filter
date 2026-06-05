import { useEffect, useState } from "react";
import "./App.css";
import { STORAGE_KEY, urlToInfo, type Data } from "./utils/constants";

function App() {
  const [posts, setPosts] = useState(0);
  const [hideForwarded, setHideForwarded] = useState(false);
  const [url, setUrl] = useState<keyof typeof urlToInfo | null>();

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

  const info = urlToInfo[url ?? "www.ozon.ru"];

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY).then(({ data }) => {
      setPosts((data as Data).postsNumber);
      setHideForwarded((data as Data).hideForwarded);
    });

    chrome.storage.sync.get("url").then(({ url }) => {
      setUrl(url as keyof typeof urlToInfo);
    });
  }, []);

  return (
    <section className="menu">
      <form className="form">
        <h3>Site detected: {info.name}</h3>
        {info.hidePostsText && (
          <label>
            {info.hidePostsText}
            <input
              type="number"
              value={posts}
              onChange={(e) => setPosts(parseInt(e.target.value))}
            />
          </label>
        )}
        {info.hideForwardedText && (
          <label>
            {info.hideForwardedText}
            <input
              type="checkbox"
              checked={hideForwarded}
              onChange={() => setHideForwarded((val) => !val)}
            />
          </label>
        )}
        <button className="counter" onClick={() => onHidePosts()}>
          {info.buttonText ?? "Apply"}
        </button>
      </form>
    </section>
  );
}

export default App;
