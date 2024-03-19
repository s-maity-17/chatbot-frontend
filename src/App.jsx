import "./App.css";
import { useState } from "react";
import { Fab, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Chatbot from "./components/chatbot/Chatbot";
import CloseIcon from "@mui/icons-material/Close";

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const handleFabClick = () => {
    // Get the position of the Fab icon
    // const fabRect = event.target.getBoundingClientRect();
    // setFabPosition({ top: fabRect.bottom, left: fabRect.left });

    // Open or close the div
    setChatOpen(!chatOpen);
  };

  return (
    <div className="app">
      {chatOpen ? <Chatbot onClose={handleFabClick} /> : null}
      <Fab
        sx={{ marginBottom: "15px", gap: 1 }}
        variant="extended"
        color="success"
        onClick={handleFabClick}
      >
        {chatOpen ? (
          <CloseIcon />
        ) : (
          <>
            <Typography>Chat With Us </Typography> <ChatBubbleIcon />
          </>
        )}
      </Fab>
    </div>
  );
};

export default App;
