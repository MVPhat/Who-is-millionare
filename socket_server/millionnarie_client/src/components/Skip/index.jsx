import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import { socket } from "../../service/socket";
import ButtonImpressive from "../ButtonImpressive";

const useStyles = makeStyles(() => ({
  btn: {
    backgroundColor: "#F4A900",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "white",
    borderRadius: 10,
    boxShadow: "5px 5px 5px rgba(0,0,0,0.4)",
    border: "2px solid white",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#f75e25",
    },
  },
}));

const Skip = ({ setIsWaiting }) => {
  const styles = useStyles();

  const name = localStorage.getItem("name") || "";
  const [canSkip, setCanSkip] = useState(localStorage.getItem("skip") || false);

  const handleClickSkip = () => {
    console.log("handleClickSkip")

    if (canSkip === "true") {
      setIsWaiting(true);

      socket.emit("player:useSkipRequest", {
        name,
      });
      setCanSkip(false);
      localStorage.setItem("skip", false);
    }
  };

  useEffect(() => {
    socket.on("server:numQuestionsLeft", (data) => {
      if (data.quesCount === 0) {
        setCanSkip(false);
        localStorage.setItem("skip", false);
      }
    });

    return () => {
      socket.off("server:numQuestionsLeft");
    };
  }, []);

  return (
    <>
      {canSkip === "true" ? (
        <div onClick={handleClickSkip} className={styles.btn}>
          Skip
        </div>
      ) : (
        <div className={styles.btn} style={{ boxShadow: "none" }}>
          Skipn't
        </div>
      )}
    </>
  );
};

export default Skip;
