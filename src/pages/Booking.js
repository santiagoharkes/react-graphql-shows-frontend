import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

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

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {allBookings.map((booking) => (
            <li key={booking._id}>
              <p>{booking.event.title}</p>
              <p>{booking.user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingPage;
