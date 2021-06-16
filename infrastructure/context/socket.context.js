import React, { createContext } from "react";

export const SocketContext = createContext(null);

export const SocketContextProvider = (props) => {
  return (
    <SocketContext.Provider value={props.socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
