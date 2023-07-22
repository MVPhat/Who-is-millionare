import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { makeStyles } from "@mui/styles";
import PersonIcon from "@mui/icons-material/Person";
import Person3Icon from "@mui/icons-material/Person3";
import { socket } from "../../service/socket";
import classNames from "classnames";

const useStyles = makeStyles(() => ({
  container: {
    width: "70vw",
    height: "50vh",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",

    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    columnGap: 20,
  },
  user: {
    backgroundColor: "#ffb347",
    border: "1px solid black",
    borderRadius: 20,
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
    padding: 10,
    columnGap: 15,
    rowGap: 15,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    // gridTemplateRows: "1fr 1fr",
    overflowY: "scroll",
  },
  userBox: {
    border: "1px solid black",
    borderRadius: 10,
    boxShadow: "inset 5px 5px 5px rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    fontSize: 32,
    padding: 20,
    backgroundColor: "#c4c4c4",
  },
  info: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr",
    rowGap: 20,
  },
  box: {
    border: "1px solid black",
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  label: {
    border: "1px solid black",
    width: "80%",
    padding: "2px 4px",
    borderRadius: 10,
    boxShadow: "inset 1px 1px 1px rgba(0, 0, 0, 0.6)",
    backgroundColor: "#c4c4c4",
    display: "flex",
    justifyContent: "center",
  },
  value: {
    fontSize: 40,
    lineHeight: 1,
    color: "white",
    fontWeight: "bold",
  },

  selectedOrder: {
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
    backgroundColor: "#77DD77",
    color: "white",
  },
}));

const UserOrder = ({ curClient, clients }) => {
  const styles = useStyles();
  const [numQuesLeft, setNumQuesLeft] = useState(0);

  useEffect(() => {
    socket.on("server:numQuestionsLeft", (data) => {
      setNumQuesLeft(data.quesCount);
    });
    return () => {
      socket.off("server:numQuestionsLeft");
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        {clients &&
          clients.map((client, idx) => (
            <div
              className={classNames(
                styles.userBox,
                idx === curClient && styles.selectedOrder
              )}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <p>{idx + 1}</p>
                <PersonIcon fontSize="inherit" color="inherit" />
              </div>
              <p style={{ fontSize: 24 }}>{client.name}</p>
            </div>
          ))}
      </div>
      <div className={styles.info}>
        <div
          className={styles.box}
          style={{
            backgroundColor: "#98d9c1",
          }}
        >
          <div className={styles.value}>{clients.length}</div>
          <div className={styles.label}>User Left</div>
        </div>
        <div
          className={styles.box}
          style={{
            backgroundColor: "#f6b870",
          }}
        >
          <div className={styles.value}>{numQuesLeft}</div>
          <div className={styles.label}>Question Left</div>
        </div>
        <div
          className={styles.box}
          style={{
            backgroundColor: "#89b76e",
          }}
        >
          <div className={styles.value}>
            {new Date().getMinutes()}:{new Date().getSeconds()}
          </div>
          <div className={styles.label}>Timer</div>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
