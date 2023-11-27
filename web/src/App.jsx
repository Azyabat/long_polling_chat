import React, { useState, useEffect } from "react";
import "./App.css";
import AceEditor from "react-ace";
import "./utils/aceConfig.js";
import { executeCode, getMessages, sendMessage } from "./api";

function App() {
  const [codeText, setCode] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  useEffect(() => {
    subscribe();
  }, []);

  const handleExecuteCode = () => {
    executeCode().then((response) => {
      console.log(response);
      setResult(response?.code);
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => sendMessage(query), 500);
    return () => clearTimeout(timeOut);
  }, [query]);

  const subscribe = async () => {
    try {
      const data = (await getMessages()).data;
      setCode(data.message);
      await subscribe();
    } catch {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };

  const onChange = async (newValue) => {
    setQuery(newValue);
    setCode(newValue);
    console.log("change", newValue);
  };

  return (
    <div className="App">
      <h2>Hello long polling chat</h2>
      <div className="Wrapper">
        <AceEditor
          mode="javascript"
          width="85vw"
          height="70vh"
          theme="monokai"
          fontSize={14}
          value={codeText}
          onChange={onChange}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <div className="output">
          <div className="buttons">
            <button onClick={handleExecuteCode}>Run</button>
          </div>
          <div className="content">
            {result?.map((resConsole) => (
              <div>{resConsole.value}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
