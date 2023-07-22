import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import Dot from "../../animations/Dot";

import { socket } from "../../service/socket";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    columnGap: 30,
    rowGap: 30,
    width: "100%",
    boxShadow: "none",
    height: "100%",
  },
  box: {
    boxShadow: "none",
    position: "relative",
    width: "100%",
  },
  answer: {
    border: "2px solid white",
    padding: "10px 20px",
    minHeight: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    // margin: "0 10%",
    display: "flex",
    gap: 10,
    alignItems: "center",
    boxShadow: "none",
    color: "white",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#008770 ",
    },
  },
  choice: {
    backgroundColor: "gray",
    borderRadius: 10,
    boxShadow: "none",
    // color: "black",
    position: "absolute",
    minHeight: 50,
    top: 0,
    left: 0,
    width: "100%",
    height: "calc(100% - 10px)",
    opacity: 0.4,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
}));

const Answers = ({ answers }) => {
  const styles = useStyles();
  const [choice, setChoice] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChoice = (idx) => {
    if (!isLoading) {
      setChoice(idx);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // let timeout = setTimeout(() => {
    socket.emit("client:sendAnswer", {
      order: localStorage.getItem("name"),
      answer: choice,
    });
    // }, 3000);

    setIsLoading(false);
    // clearTimeout(timeout);
  };

  return (
    <>
      <div className={styles.container}>
        {answers.length > 0 ? (
          answers.map((answer, idx) => (
            <div className={styles.box} key={answer + idx}>
              <div
                className={styles.answer}
                onClick={() => handleSelectChoice(idx)}
              >
                <div
                  style={{
                    boxShadow: "none",
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div
                  style={{
                    boxShadow: "none",
                  }}
                >
                  {answer}
                </div>
              </div>
              {choice === idx && (
                <div className={styles.choice} onClick={handleSubmit}>
                  {/* <Dot type="pulse" /> */}
                  <div style={{ boxShadow: "none", marginRight: 40 }}>
                    {isLoading && <Dot type="pulse" color="black" />}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.box}>Tra loi cau hoi di m</div>
        )}
      </div>
    </>
  );
};

export default Answers;
