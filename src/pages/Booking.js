import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Booking/BookingList/BookingList";

import "./Booking.css";

function BookingPage() {
  const context = useContext(authContext);

  const [isLoading, setIsLoading] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const fetchBookings = () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
            user {
              _id
              email
            }
         }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Algo falló!");
        }
        setIsLoading(false);
        return res.json();
      })
      .then((data) => {
        const allBookings = data.data.bookings;
        setAllBookings(allBookings);
        console.log(allBookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const onDelete = (bookingId) => {
    setIsLoading(true);

    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Algo falló!");
        }
        setIsLoading(false);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const filterBookings = allBookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        setAllBookings(filterBookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="booking__content">
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList booking={allBookings} onDelete={onDelete} />
      )}
    </div>
  );
}

export default BookingPage;
