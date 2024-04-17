import {
  Avatar,
  Box,
  Badge,
  Typography,
  IconButton,
  Input,
  Chip,
} from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "./Chatbot.css";
import ConnectBud from "../../assets/ConnectBud.png";
import BotIcon from "../../assets/BotIcon.png";
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
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setMessages([
      {
        text: dataset[0].answer,
        user: false,
        menulist: [
          {
            title: "Hire a Tutor",
            url: "https://www.connectbud.com/parent-login",
          },
          {
            title: "Become a Tutor",
            url: "https://www.connectbud.com/tutor-login",
          },
          {
            title: "Book A Free Demo Class",
            url: "https://www.connectbud.com/courses?title=Coding",
          },
          { title: "Have Other Queries", url: "" },
        ],
        delivered_at: Date.now(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  const askBot = async (userInput) => {
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
        }, 10); // Delay before typing animation starts

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

  const onQuerySelection = (item) => {
    if (item?.title === "Have Other Queries") {
      setIsDisabled(false);
      askBot(item?.title);
    } else {
      window.open(item?.url);
    }
  };

  return (
    <>
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
                {isTyping ? <div className=" typing">typing...</div> : "Online"}
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
                      src={BotIcon}
                      sx={{
                        height: 25,
                        width: 25,
                        border: "0.5px solid black",
                        boxShadow: "2px 5px 10px -1px rgba(0, 0, 0, 1)",
                        marginTop: "1px",
                      }}
                    />
                  ) : null}
                  <div>
                    <Typography
                      fontSize={14}
                      className={msg.user ? "user-msg" : "bot-msg"}
                    >
                      {msg.text}
                    </Typography>
                    {msg?.menulist?.length ? (
                      <Box
                        mt={2}
                        display={"flex"}
                        flexDirection={"column"}
                        gap={1}
                      >
                        {msg?.menulist?.map((item, index) => (
                          <Chip
                            key={index}
                            label={item?.title}
                            // variant="outlined"
                            // color="success"
                            onClick={() => onQuerySelection(item)}
                            sx={{
                              backgroundColor: "darkslategrey",
                              color: "#fff",
                              ":hover": { color: "#000" },
                            }}
                          />
                        ))}
                      </Box>
                    ) : null}
                    <Typography
                      gap={1}
                      fontSize={12}
                      fontWeight={550}
                      style={{ textAlign: msg.user ? "end" : "start" }}
                    >
                      {moment(msg.delivered_at).format("LT")}
                      {msg.user ? (
                        <DoneAllOutlinedIcon
                          sx={{ fontSize: "15px", marginLeft: "3px" }}
                          color={"primary"}
                        />
                      ) : null}
                    </Typography>
                  </div>
                </div>
                <div ref={bottomRef}></div>
              </>
            ))}
          </Box>
        </Box>
        {/* {isTyping && <div className=" typing">Assistant is typing...</div>} */}
        {/* <Divider /> */}
        {/* user input section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askBot(userInput);
          }}
        >
          <Box className="chat-footer">
            <Input
              type="text"
              placeholder="Write your message here..."
              sx={{ width: "80%", marginLeft: "20px" }}
              disableUnderline
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isDisabled}
            />
            <IconButton
              sx={{ width: "10%", color: "darkslategrey" }}
              type="submit"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Chatbot;
