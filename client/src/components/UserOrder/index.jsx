import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { makeStyles } from "@mui/styles";
import PersonIcon from "@mui/icons-material/Person";
import Person3Icon from "@mui/icons-material/Person3";
import { socket } from "../../service/socket";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "none",
    width: "50vh",
    height: "50vh",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  icon: {
    fontSize: 40,
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    padding: 5,
    backgroundColor: "white",
    color: "#c4c4c4",
    borderRadius: 40,
  },
  userOrder: {
    backgroundColor: "green",
    color: "white",
    border: "2px solid white",
    boxShadow: "1px 1px 2px rgba(0, 0, 0,0.4)",
  },
  dashLine: {
    margin: "5px 0",
    width: "90%",
    border: "2px dashed #c4c4c4",
    // background:
    //   "repeating-linear-gradient(to right,transparent,transparent 10px,black 10px,black 20px)",
    position: "absolute",
    zIndex: 0,
  },
}));

const UserOrder = ({ clients, status, setStatus, curClient }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div
        style={{
          boxShadow: "none",
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "1px solid black",
        }}
      >
        {/* <hr className={styles.dashLine}></hr> */}
        {clients &&
          clients.map((x, i) => (
            <p
              className={
                i !== curClient
                  ? styles.icon
                  : classnames(styles.icon, styles.userOrder)
              }
              style={{
                position: "absolute",
                left: `${
                  25 * (1 - Math.cos(((2 * Math.PI) / clients.length) * i))
                }vh`,
                top: `${
                  25 * (1 - Math.sin(((2 * Math.PI) / clients.length) * i))
                }vh`,
                transform: "translate(-50%, -50%)",
              }}
              id={i}
              key={i}
            >
              {x.isMale ? (
                <PersonIcon
                  key={x}
                  style={{ fontSize: "inherit", color: "inherit" }}
                />
              ) : (
                <Person3Icon
                  key={x}
                  style={{ fontSize: "inherit", color: "inherit" }}
                />
              )}
            </p>
          ))}

        {status !== "" && (
          <p
            style={{
              position: "sticky",
              bottom: 20,
              left: "50%",
              transform: "translate(-50%,0)",
              fontWeight: "bold",
              color: "white",
              fontSize: 24,
            }}
          >
            {/* {status} */}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
