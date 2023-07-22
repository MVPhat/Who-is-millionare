import { makeStyles } from "@mui/styles";
import classnames from "classnames";
import React, { useState, useEffect } from "react";

import { socket } from "../../service/socket";

const useStyles = makeStyles(() => ({
  container: {
    boxShadow: "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundOpacity: 0.8,
    border: "2px solid white",
    padding: "10px 20px",
    boxShadow: "none",
    borderRadius: 10,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  image_question_container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 10,
    alignContent: "center",
    padding: 50,
  },
  question: {
    height: "fit-content",
  },

  image: {
    width: "100%",
    border: "5px solid #189",
    borderRadius: 10,
  },
}));
const Question = ({ question, url, quesLeft = 11 }) => {
  const styles = useStyles();

  return (
    <div
      className={classnames(
        styles.container,
        url && styles.image_question_container
      )}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          margin: 10,
          backgroundColor: "#c4c4c4",
          borderRadius: 10,
          padding: 10,
          boxShadow: "inset 5px 5px 5px rgba(0, 0, 0, 0.4",
          border: "2px solid white",
        }}
      >
        {localStorage.getItem("setLength") - quesLeft}/
        {localStorage.getItem("setLength")}
      </div>
      <p className={styles.question}>{question}</p>
      {url && (
        <img
          src={`http://localhost:8080/image/${url}.png`}
          className={styles.image}
        />
      )}
    </div>
  );
};

export default Question;
