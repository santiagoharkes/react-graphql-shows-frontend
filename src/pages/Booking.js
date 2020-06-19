import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";

function BookingPage() {
  const context = useContext(authContext);

  const [isLoading, setIsLoading] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const fetchBookings = () => {
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
        return res.json();
      })
      .then((data) => {
        console.log(data);
        /*         setAllBookings(allBookings);
        console.log(allBookings);
        setIsLoading(false) */
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return <div>sdsdsd</div>;
}

export default BookingPage;
