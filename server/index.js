const express = require("express");
const cors = require("cors");
const events = require("events");
const vm = require("node:vm");
const { getScriptContext } = require("./helpers");
const consolesBuffer = require("./consolesBuffer");

let codeBuffer = "";
const scriptContext = getScriptContext();

const emitter = new events.EventEmitter();

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

vm.createContext(scriptContext);

app.get("/get-messages", (req, res) => {
  emitter.once("newMessage", (message) => {
    codeBuffer = message.message;
    res.json(message);
  });
});

app.post("/new-message", (req, res) => {
  const msg = req.body;
  emitter.emit("newMessage", msg);

  res.status(200);
  res.end();
});

app.post("/execute_code", async (req, res) => {
  consolesBuffer.clear();

  let compiledCode = await vm.compileFunction(codeBuffer, undefined, {
    parsingContext: scriptContext,
    filename: "code.js",
  });

  try {
    compiledCode();
  } catch (error) {
    res.json({
      code: [
        {
          type: "error",
          value: error.message,
        },
      ],
    });

    return;
  }

  res.json({ code: consolesBuffer.buffer });
});

app.listen(PORT, () => console.log(`server started on ${PORT}...`));
