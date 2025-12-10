import { useState } from 'react'
import './App.css'
import './forgecss.css';
import fx from '../../../packages/forgecss/fx'

function App() {
  const [ progress, setProgress ] = useState(false);

  function submit(e) {
    e.preventDefault();
    setProgress(true);
  }

  return (
    <main className={fx("p1")}>
      <form onSubmit={submit} className={fx("fullw desktop:w400")}>
        <fieldset>
          <label className={fx("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
            <span>Username:</span>
            <input
              type="text"
              name="username"
              placeholder="..."
              disabled={progress}
              className={fx("disabled:op05 fullw desktop:autow")}
            />
          </label>
          <label className={fx("flex-col align-start desktop:flex-row,align-center gap1 space-between")}>
            <span>Password:</span>
            <input
              type="text"
              name="username"
              placeholder="..."
              disabled={progress}
              className={fx("disabled:op05 fullw desktop:autow")}
            />
          </label>
          <button
            type="submit"
            className={fx("hover:primary2-bg disabled:op05 [&:disabled:hover]:primary-bg")}
            disabled={progress}
          >
            {progress ? "Logging in ... " : "Login"}
          </button>
        </fieldset>
      </form>
    </main>
  );
}

export default App
