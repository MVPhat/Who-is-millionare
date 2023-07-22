import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import { socket } from "../../service/socket";
import ButtonImpressive from "../ButtonImpressive";

const useStyles = makeStyles(() => ({
  btn: {
    backgroundColor: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "white",
    borderRadius: 10,
  },
}));

const Skip = ({setIsWaiting}) => {
  const styles = useStyles();

  const name = localStorage.getItem("name") || "";
  const [canSkip, setCanSkip] = useState(localStorage.getItem("skip") || false);

  const handleClickSkip = () => {
    if (canSkip === "true") {
		setIsWaiting(true)

      socket.emit("client:skipQuestion", {
        name,
      });
      setCanSkip(false);
      localStorage.setItem("skip", false);
    }
  };

  useEffect(() => {
	socket.on("server:countQuesLeft", (data) => {
		if (data.quesCount === 0 ) {
			setCanSkip(false);
			localStorage.setItem('skip', false);
		}
	})

	return () => {
		socket.off('server:countQuesLeft')
	}
  }, [])

  return (
    <>
      {canSkip === "true" ? (
        <ButtonImpressive onClick={handleClickSkip} className={styles.btn}>
          {`>>> Skip Question >>>`}
        </ButtonImpressive>
      ) : (
        <div className={styles.btn} style={{ boxShadow: "none" }}>
          Cannot skip question
        </div>
      )}
    </>
  );
};

export default Skip;
