const { WebSocket } = require("ws");

class DemoLlmClient {
  constructor() {
  }

  BeginMessage(ws) {
    const res = {
      response_id: 0,
      content: "How may I help you?",
      content_complete: true,
      end_call: false,
    };
    ws.send(JSON.stringify(res));
  }

  async DraftResponse(request, ws) {
    if (request.interaction_type === "update_only") {
      // process live transcript update if needed
      return;
    }

    try {
      const res = {
        response_id: 1,
        content: "I am sorry, can you say that again?",
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(res));
    } catch (err) {
      console.error("Error in gpt stream: ", err);
    }
  }
}
module.exports = { DemoLlmClient };
