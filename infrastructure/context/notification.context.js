import React, { createContext } from "react";

export const NotifContext = createContext(null);

export const NotifContextProvider= (props) => {
  return (
    <NotifContext.Provider value={props.notifs}>
      {props.children}
    </NotifContext.Provider>
  );
};
