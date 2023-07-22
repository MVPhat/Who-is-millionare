import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import Answers from "../../components/Answers";
import Countdown from "../../components/Countdown";
import Question from "../../components/Question";
import Skip from "../../components/Skip";
import UserOrder from "../../components/UserOrder";
import { socket } from "../../service/socket";

import Congratulation from "../../assets/Congratulations.png";
import WrongAns from "../../assets/wrong_ans.png";
import Timeout from "../../assets/timeout.png";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateRows: "auto 100px",
    rowGap: 40,
    maxWidth: "100%",
    height: "100vh",
    padding: "5vh 10vw",
  },
  gear: {
    display: "flex",
    height: 500,
    boxShadow: "none",
  },
}));

const QuestionScreen = () => {
  const styles = useStyles();
  const [isWaiting, setIsWaiting] = useState(true);
  const [status, setStatus] = useState(null);
  const [clients, setClients] = useState([]);
  const [curClient, setCurClient] = useState(0);

  const [isWinner, setIsWinner] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on("server:syncData", (data) => {
      setClients([
        ...data.clientNames.map((name) => ({
          name,
        })),
      ]);

      setStatus(data.status);
    });

    socket.on("server:waitingNextQuestion", (data) => {
      if (data.curName !== localStorage.getItem("name")) {
        setIsWaiting(true);
      } else {
      }
    });

    socket.on("server:sendQuestion", (data) => {
      setIsWaiting(false);
      setData(data);
    });

    socket.on("server:answerCorrect", (data) => {
      setIsWaiting(true);
      setStatus("Congratulations!! Your answer was correct");
    });

    socket.on("server:wrongAnswer", () => {
      setIsWaiting(true);
      setStatus("Poor u!!!");
    });

    socket.on("server:timeout", () => {
      setIsWaiting(true);
      setStatus("Poor u is timeout!");
    });

    socket.on("server:waitingNextQuestion", (data) => {
      const nextClient =
        data.curClient === clients.length - 1 ? 0 : data.curClient + 1;

      if (nextClient === localStorage.getItem("order")) {
        setStatus("You will have answered for next question");
      }

      // localStorage.setItem("curClient", parseInt(data.curClient, 10));
      setCurClient(data.curClient);
    });

    socket.on("server:endGame", () => {
      setIsWinner(true);
    });

    return () => {
      socket.off("server:waitingNextQuestion");
      socket.off("server:waitingNextQuestion");
      socket.off("server:sendQuestion");
      socket.off("server:syncData");
      socket.off("server:answerCorrect");
      socket.off("server:wrongAnswer");
      socket.off("server:endGame");
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
                width: "50vw",
                borderRadius: 20,
              }}
            />
          ) : (
            <>
              {status === "Poor u!!!" ? (
                <img alt="Wrong answer" src={WrongAns} />
              ) : status === "Poor u is timeout!" ? (
                <img alt="Timeout" src={Timeout} />
              ) : (
                <UserOrder clients={clients} curClient={curClient} />
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
              gap: 50,
            }}
          >
            {data && data.question && (
              <Question question={data.question} url={data.url} />
            )}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "auto 50px",
                gap: 10,
              }}
            >
              <Countdown type={"process"} />
              <Skip setIsWaiting = {setIsWaiting}/>
            </div>
          </div>
          {data && data.answers && <Answers answers={data.answers} />}
        </div>
      )}
    </>
  );
};

export default QuestionScreen;
