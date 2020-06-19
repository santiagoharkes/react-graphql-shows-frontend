import React from "react";
import EventItem from "../EventItem/EventItem";

function EventList({ allEvents, authUserId, onViewDetail }) {
  return (
    <>
      {allEvents.map((event) => (
        <EventItem
          key={event._id}
          event={event}
          authUserId={authUserId}
          onDetail={onViewDetail}
        />
      ))}
    </>
  );
}

export default EventList;
