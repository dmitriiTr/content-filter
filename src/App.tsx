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

  const info = url ? urlToInfo[url] : null;

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY).then(({ data }) => {
      setPosts((data as Data).postsNumber);
      setHideForwarded((data as Data).hideForwarded);
    });

    const getHostName = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setUrl(
        tab.url ? (new URL(tab.url).hostname as keyof typeof urlToInfo) : null,
      );
    };

    getHostName();
  }, []);

  return (
    <section className="menu">
      <form className="form">
        <h3>Site detected: {info?.name ?? "Not supported"}</h3>
        {info && (
          <>
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
            <button
              type="button"
              className="counter"
              onClick={() => onHidePosts()}
            >
              {info.buttonText ?? "Apply"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}

export default App;
