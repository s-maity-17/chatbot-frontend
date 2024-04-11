import {
  Avatar,
  Box,
  Badge,
  Typography,
  Divider,
  IconButton,
  Input,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "./Chatbot.css";
import ConnectBud from "../../assets/ConnectBud.png";
import dataset from "../../dataset.json";
import axios from "axios";
import moment from "moment";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Chatbot = ({ onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages([
      {
        text: dataset[0].answer,
        user: false,
        menulist: [],
        delivered_at: Date.now(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  const askBot = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    console.log("userInput", userInput);
    const userMessage = {
      text: userInput,
      user: true,
      delivered_at: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    // setIsTyping(true);
    // Axios POST request
    axios
      .post("http://127.0.0.1:5000/chat-bot", { question: userInput })
      .then((response) => {
        console.log("Response:", response.data.answer);
        // Handle response data here
        const botMsg = {
          text: response.data.answer,
          delivered_at: Date.now(),
          user: false,
          menulist: [],
        };
        // setMessages((prev) => [...prev, botMsg]);
        const typingTimer = setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, botMsg]);
          }, 2000); // Adjust the duration of typing animation as needed
        }, 100); // Delay before typing animation starts

        return () => clearTimeout(typingTimer);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors here
      })
      .finally(
        console.log("first")
        // setIsTyping(false);
      );
    setUserInput("");
  };

  return (
    <Box className="chatbot-container">
      {/* header section */}
      <Box className="header-container">
        <Box className="header-profile">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar src={ConnectBud} />
          </StyledBadge>
          <Box>
            <Typography
              color={"#fff"}
              ml={2}
              fontFamily={"sans-serif"}
              fontWeight={550}
            >
              ConnectBud Assistant
            </Typography>
            <Typography
              color={"#fff"}
              ml={2}
              fontFamily={"sans-serif"}
              fontSize={12}
            >
              Online
            </Typography>
          </Box>
        </Box>
        <CloseIcon
          sx={{
            padding: "10px",
            cursor: "pointer",
            marginRight: "10px",
            color: "#fff",
          }}
          onClick={onClose}
        />
      </Box>

      {/* chat body */}
      <Box className="chat-body">
        <Box
          id="chat-window"
          sx={{
            padding: "20px",
            margin: "5px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, index) => (
            <>
              <div
                key={index}
                style={{
                  display: "flex",
                  width: msg.user ? "" : "fit-content",
                  justifyContent: msg.user ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                {!msg.user ? (
                  <Avatar
                    src={ConnectBud}
                    sx={{
                      height: 20,
                      width: 20,
                      border: "1px solid black",
                      // boxShadow: "2px 5px 10px -1px rgba(0, 0, 0, 1)",
                      // marginBottom:'5px'
                    }}
                  />
                ) : null}
                {/* <MyLoader/> */}
                <div>
                  <Typography
                    fontSize={14}
                    className={msg.user ? "user-msg" : "bot-msg"}
                  >
                    {msg.text}
                  </Typography>
                  <Typography
                    mt={1}
                    fontSize={11}
                    style={{ textAlign: msg.user ? "end" : "start" }}
                  >
                    {moment(msg.delivered_at).format("LT")}
                    {/* {moment(msg.delivered_at).format("LT")} */}
                  </Typography>
                </div>
              </div>

              <div ref={bottomRef}></div>
            </>
          ))}
        </Box>
      </Box>
      {isTyping && <div className=" typing">Assistant is typing...</div>}
      <Divider />
      {/* user input section */}
      <form onSubmit={askBot}>
        <Box className="chat-footer">
          <Input
            type="text"
            placeholder="Write your message here..."
            sx={{ width: "80%", marginLeft: "20px" }}
            disableUnderline
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            // disabled={isDisabled}
          />
          <IconButton sx={{ width: "10%", color: "green" }} type="submit">
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default Chatbot;
