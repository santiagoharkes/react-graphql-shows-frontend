import React from "react";

import "../Events.css";

function EventItem({ event, authUserId, onDetail }) {
  return (
    <>
      <li key={event._id} className="events__list-item">
        <div className="events__list-item-text">
          <h1>{event.title}</h1>
          <h2>${event.price}</h2>
          <p>{new Date(event.date).toLocaleDateString()}</p>
        </div>
        <div className="events__list-item-info">
          {authUserId === event.creator._id ? (
            <p>Sos el creador de este evento</p>
          ) : (
            <button onClick={() => onDetail(event._id)}>View Details</button>
          )}
        </div>
      </li>
    </>
  );
}

export default EventItem;
