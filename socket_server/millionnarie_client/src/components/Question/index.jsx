import { makeStyles } from "@mui/styles";
import classnames from "classnames";
import React from "react";
import GearIcon from "../Gear";

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: "#256D7B",
    backgroundOpacity: 0.8,
    border: "5px solid white",
    boxShadow: "5px 5px 5px rgba(0,0,0,0.4)",

    padding: "10px 20px",
    borderRadius: 20,
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
    color: "white",
    height: "fit-content",
    fontSize: 24,
  },

  image: {
    width: "100%",
    border: "5px solid #189",
    borderRadius: 10,
  },
}));
const Question = ({ question, url }) => {
  const styles = useStyles();

  return (
    <div
      className={classnames(
        styles.container,
        url && styles.image_question_container
      )}
    >
      <p className={styles.question}>{question}</p>
      {url && (
        <img
          src={`http://localhost:2023/image/${url}.png`}
          className={styles.image}
        />
      )}
    </div>
  );
};

export default Question;
