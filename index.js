// const express = require('express')
// const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })
// app.listen(process.env.PORT || 3000)



// npm install --save-dev @types/ws
const WebSocket = require("ws");
const express = require('express');
const app = express();
const DemoLlmClient = require("./dumb_llm").DemoLlmClient;
const expressWs = require('express-ws')(app);
const port = 8080;

var llmClient = new DemoLlmClient();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.ws("/llm-websocket/:call_id", async (ws, req) => {
  const callId = req.params.call_id;

  ws.on("error", (err) => {
    console.error("Error received in LLM websocket client: ", err);
  });

  // Begin message
  llmClient.BeginMessage(ws);

  ws.on("message", async (data, isBinary) => {
    if (isBinary) {
      console.error("Got binary message instead of text in websocket.");
      ws.close(1002, "Cannot find corresponding Retell LLM.");
    }
    try {
      const request = data.toString();
      // LLM will think about a response
      llmClient.DraftResponse(request, ws);
    } catch (err) {
      console.error("Error in parsing LLM websocket message: ", err);
      ws.close(1002, "Cannot parse incoming message.");
    }
  });
});

app.listen(port || process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
