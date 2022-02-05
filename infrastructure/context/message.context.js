import React, { createContext } from "react";

export const MsgContext = createContext(null);

export const MsgContextProvider = (props) => {
  return (
    <MsgContext.Provider value={props.messages}>
      {props.children}
    </MsgContext.Provider>
  );
};
