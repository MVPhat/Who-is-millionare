import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import UserOrder from "../../components/UserOrder";
import Countdown from "../../components/Countdown";
import Question from "../../components/Question";
import Answers from "../../components/Answers";
import GearIcon from "../../components/Gear";
import Skip from "../../components/Skip";
import { socket } from "../../service/socket";

import Banner from "../../assets/banner_corrcet.png";
import WrongAns from "../../assets/wrong_ans.png";
import Congratulation from "../../assets/Congratulations.png";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    // justifyContent: "space-between",
    // alignItems: "center",
    // flexDirection: "column",
    gridTemplateRows: "auto 50px 200px",
    rowGap: 50,
    maxWidth: "100%",
    height: "90vh",
    // maxHeight: "100vh",
    padding: "5vh 10vw",
  },
  gear: {
    display: "flex",
    height: 500,
    boxShadow: "none",
  },
}));

const CountLeftQues = () => {
  const [numQuesLeft, setNumQuesLeft] = useState(0);

  useEffect(() => {
    socket.on("server:countQuesLeft", (data) => {
      console.log(data);
      setNumQuesLeft(data.quesCount);
    });
    return () => {
      socket.off("server:countQuesLeft");
    };
  }, []);

  return (
    <p style={{ fontWeight: "bold", fontSize: 50, color: "white" }}>
      {numQuesLeft}
    </p>
  );
};

const QuestionScreen = () => {
  const styles = useStyles();
  const [isWaiting, setIsWaiting] = useState(true);
  const [status, setStatus] = useState(null);
  const [clients, setClients] = useState([]);
  const [curClient, setCurClient] = useState(0);

  const [isWinner, setIsWinner] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("server:updateClient", (data) => {
      setClients([
        ...data.clientNames.map((name) => ({
          name,
        })),
      ]);

      if (data.setLength) {
        localStorage.setItem("setLength", data.setLength);
      }

      setStatus(data.status);
    });

    socket.on("server:waitingForQuestion", (data) => {
      if (data.curName !== localStorage.getItem("name")) {
        setIsWaiting(true);
      } else {
      }
    });

    socket.on("server:sendQuestion", (data) => {
      setIsWaiting(false);
      setData(data);
    });

    socket.on("server:correctAnswer", () => {
      setIsWaiting(true);
      setStatus("Congratulations!! Your answer was correct");
    });

    socket.on("server:wrongAnswer", () => {
      setIsWaiting(true);
      setStatus("Poor u!!!");
    });

    socket.on("server:waitingForQuestion", (data) => {
      const nextClient =
        data.curClient === clients.length - 1 ? 0 : data.curClient + 1;

      if (nextClient === localStorage.getItem("order")) {
        setStatus("You will have answered for next question");
      }

      // localStorage.setItem("curClient", parseInt(data.curClient, 10));
      setCurClient(data.curClient);
    });

    socket.on("server:winner", () => {
      setIsWinner(true);
    });

    return () => {
      socket.off("server:waitingForQuestion");
      socket.off("server:waitingForQuestion");
      socket.off("server:sendQuestion");
      socket.off("server:updateClient");
      socket.off("server:correctAnswer");
      socket.off("server:wrongAnswer");
      socket.off("server:winner");
    };
  }, []);

  return (
    <>
      {isWaiting || isWinner ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {isWinner ? (
            <img
              alt="Congratulation"
              src={Congratulation}
              style={{
                width: "25vw",
                height: "25vw",
                borderRadius: 20,
                border: "5px solid white",
              }}
            />
          ) : (
            <>
              {status === "Poor u!!!" ? (
                <img alt="Wrong answer" src={WrongAns} />
              ) : (
                <>
                  <UserOrder
                    clients={clients}
                    status={status}
                    setStatus={setStatus}
                    curClient={curClient}
                  />
                  {/* // <img alt="banner" src={Banner} /> */}
                  <CountLeftQues />
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className={styles.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 10%",
              boxShadow: "none",
              gap: 20,
            }}
          >
            {data && data.question && (
              <Question
                question={data.question}
                url={data.url}
                quesLeft={data.quesLeft}
              />
            )}
            <Countdown type={"process"} />
          </div>
          <Skip setIsWaiting={setIsWaiting} />
          {/* <div className={styles.gear}>
        <GearIcon />
      </div> */}
          {data && data.answers && <Answers answers={data.answers} />}
        </div>
      )}
    </>
  );
};

export default QuestionScreen;
