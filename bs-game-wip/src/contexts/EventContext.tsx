import React, { createContext, useState } from "react";

export const EventContext = createContext(undefined);

export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState(null);

  const triggerEvent = (eventData) => {
    setEvent(eventData);
  };

  return (
    <EventContext.Provider value={{ event, triggerEvent }}>
      {children}
    </EventContext.Provider>
  );
};
