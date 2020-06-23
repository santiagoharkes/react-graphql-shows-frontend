import React from "react";

import "../../../pages/Booking.css";

const bookingList = (props) => (
  <ul className="booking__content-ul">
    {props.booking.map((booking) => {
      return (
        <li key={booking._id}>
          <div className="booking__content-text">
            <h1>{booking.event.title}</h1>
            <p>{booking.user.email}</p>
          </div>
          <div className="booking__content-button">
            <button onClick={() => props.onDelete(booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default bookingList;
