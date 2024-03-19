import {
  Avatar,
  Box,
  Badge,
  Typography,
  Divider,
  IconButton,
  Input,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import "./Chatbot.css";
import ConnectBud from "../../assets/ConnectBud.png";
import dataset from "../../dataset.json";
import * as tf from "@tensorflow/tfjs";
// const axios = require("axios");
import axios from 'axios'
// import * as model from '../../model';
// import * as qna from "@tensorflow-models/qna";
// import { trainingData } from "../../dataModel";
// import MyLoader from "../loder/Typing";

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

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");

  // Load the custom chatbot model
  const model = tf.loadLayersModel("localstorage://my-model-1");

  // const [ans, setAns] = useState();
  // const [model, setModel] = useState(null);

  // load tensorflow model
  // const loadModel = async () => {
  //   const loadedModel = await qna.load();
  //   setModel(loadedModel);
  //   console.log("loadedModel", loadedModel);
  // };

  useEffect(() => {
    // loadModel();
    // console.log("dataset", dataset[1].option);
    setMessages([{ text: dataset[0].answer, user: false, menulist: [] }]);
    setMessages((prev) => [
      ...prev,
      { text: dataset[1].answer, user: false, menulist: dataset[1].option },
    ]);
  }, []);

  useEffect(() => {
    // console.log("selectedMenu", selectedMenu);
    if (selectedMenu?.length) {
      setMessages((prev) => [
        ...prev,
        { text: selectedMenu, user: true, menulist: [] },
      ]);
    }
  }, [selectedMenu]);

  const askBot = async () => {
    if (!userInput.trim()) return;
    
    console.log("userInput", userInput);
    const userMessage = { text: userInput, user: true };
    setMessages((prev) => [...prev, userMessage]);
    // Axios POST request
    axios
      .post("http://127.0.0.1:5000/chat-bot", {'question':userInput})
      .then((response) => {
        console.log("Response:", response.data.answer);
        // Handle response data here
        const botMsg = {
                text: response.data.answer,
                user: false,
                menulist: [],
              };
              setMessages((prev) => [...prev, botMsg]);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors here
      });
      setUserInput("");
    // setTimeout(
    //   function () {
    //     setIsLoading(true);
    //     const botReply = dataset.filter(
    //       (item) => item.question.toLowerCase() === userInput.toLowerCase()
    //     );
    //     console.log("botReply", botReply);
    //     const botMsg = {
    //       text: botReply[0].answer,
    //       user: false,
    //       menulist: botReply[0].option,
    //     };
    //     setMessages((prev) => [...prev, botMsg]);
    //   },
    //   [2000]
    // );

    // setUserInput("");
    // console.log("dataset", dataset);
    // if (model !== null) {
    //   const answers = await model.findAnswers(userInput, trainingData);
    //   console.log("answers123", answers);
    // }

    // Convert user input to tensor
    const inputTensor = tf.tensor2d([userInput], [1, 1]);
    console.log("inputTensor", inputTensor);
    // Get model prediction
    const outputTensor = await model.predict(inputTensor);
    console.log("outputTensor", outputTensor);
    // Convert output tensor to text
    const botResponse = await outputTensor.data();
    console.log("botResponse", botResponse);
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
        />
      </Box>

      {/* chat body */}
      <Box className="chat-body">
        <Box
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
                <Typography
                  fontSize={14}
                  className={msg.user ? "user-msg" : "bot-msg"}
                >
                  {msg.text}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-evenly",
                }}
              >
                {msg.menulist
                  ? msg.menulist.map((item, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => setSelectedMenu(item)}
                        style={{ fontSize: "12px" }}
                      >
                        {item}
                      </Button>
                    ))
                  : null}
              </div>
            </>
          ))}
        </Box>
      </Box>
      <Divider />
      {/* user input section */}
      <Box className="chat-footer">
        <Input
          type="text"
          placeholder="Type Message here..."
          sx={{ width: "80%", marginLeft: "20px" }}
          disableUnderline
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          // disabled={isDisabled}
        />
        <IconButton sx={{ width: "10%", color: "green" }} onClick={askBot}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chatbot;
