import { useReducer } from 'react';
import './forgecss.css';
import fx from 'forgecss/fx'
import { Editor } from './Editor';
import { DEFAULT_FILES } from './constants';

type File = {
  filename: string,
  content: string,
  selected: boolean,
  type: string
}

function filesReducer(state: File[], action: { type: string; payload?: any }) {
  if (action.type === "selected") {
    state = state.map((file, i) => ({
      ...file,
      selected: action.payload === i
    }))
  } else if (action.type === "change") {
    const [filename, content] = action.payload;
    state = state.map((file) => ({
      ...file,
      content: file.filename === filename ? content : file.content
    }))
  }
  return state;
}

function App() {
  const [files, updateFiles] = useReducer(filesReducer, DEFAULT_FILES);
  const selected = files.filter((f) => f.selected)[0];

  return (
    <>
      <header>
        <div className={fx("maxw1000 mxauto p1 desktop:mt1")}>
          <img src="/forgecss.svg" width="100" height="100" />
        </div>
      </header>
      <main>
        <div className={fx("maxw1000 mxauto")}>
          <div className={fx("desktop:grid2 gap1 p1")}>
            <div className="flex-col minh400">
              <Tabs files={files} onClick={(i: number) => updateFiles({ type: "selected", payload: i })} />
              <Editor
                code={selected.content}
                language={selected.type}
                className="flex1"
                key={selected.filename}
                onChange={(code) => updateFiles({ type: "change", payload: [selected.filename, code] })}
              />
            </div>
            <div className={fx("flex-col minh400 mobile:mt1")}>
              <p style={{ lineHeight: '20px' }}>Compiles to</p>
              <Editor code={""} language="css" className="mt1 flex1" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Tabs({ files, onClick }: { files: File[]; onClick: Function }) {
  return (
    <ul className="files">
      {files.map((file, i) => {
        return (
          <li key={file.filename} className={fx(`[${file.selected}]:selected`)}>
            <button onClick={() => onClick(i)}>{file.filename}</button>
          </li>
        );
      })}
    </ul>
  );
}

export default App
