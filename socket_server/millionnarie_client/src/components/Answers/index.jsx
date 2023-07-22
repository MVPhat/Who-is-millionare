import { makeStyles } from "@mui/styles";
import React from "react";

import { socket } from "../../service/socket";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    columnGap: 30,
    width: "100%",
    boxShadow: "none",
    height: "100%",
  },
  box: {
    position: "relative",
    width: "100%",
  },
  answer: {
    border: "5px solid white",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
    padding: "10px 20px",
    minHeight: 50,
    backgroundColor: "#2A6478",
    display: "flex",
    gap: 10,
    alignItems: "center",
    color: "white",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#008770 ",
      color: "white",
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

  const handleSubmit = (idx) => {
    socket.emit("player:answerQuestion", {
      order: localStorage.getItem("name"),
      answer: idx,
    });
  };

  return (
    <>
      <div className={styles.container}>
        {answers.length > 0 ? (
          answers.map((answer, idx) => (
            <div
              className={styles.box}
              key={answer + idx}
              onClick={() => handleSubmit(idx)}
            >
              <div
                className={styles.answer}
                onClick={() => handleSelectChoice(idx)}
              >
                <div style={{ color: "inherit" }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div style={{ color: "inherit" }}>{answer}</div>
              </div>
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
