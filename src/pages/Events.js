import React, { useState, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import authContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

function EventsPage() {
  const context = useContext(authContext);

  const [creating, setCreating] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    price: "",
    date: "mm/dd/yyyy",
  });
  const [allEvents, setAllEvents] = useState([]);
  const [token, setToken] = useState(context.token);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    eventState: false,
    eventData: {},
  });

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: 
            { 
              title: "${eventData.title}", 
              price: ${eventData.price}, 
              date: "${eventData.date}", 
              description: "${eventData.description}"})
                {
                _id
                title
                price
                description
                creator {
                    _id
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
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          setEventData({
            title: "",
            description: "",
            price: "",
            date: "",
          });
          throw new Error("Algo falló!");
        }
        setCreating(false);
        setEventData({
          title: "",
          description: "",
          price: "",
          date: "",
        });
        return res.json();
      })
      .then((data) => {
        console.log(data.data.createEvent);
        setAllEvents([...allEvents, data.data.createEvent]);
        /*         fetchEvents(); */
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalBookHandler = () => {
    if (!token) {
      setSelectedEvent({
        eventState: false,
        eventData: {},
      });
      return;
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent.eventData._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
        setSelectedEvent({
          eventState: false,
          eventData: {},
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent({
      eventState: false,
      eventData: {},
    });
  };

  const titleChangeHandler = (e) => {
    const title = e.target.value;
    setEventData({ ...eventData, title: title });
  };
  const descriptionChangeHandler = (e) => {
    const description = e.target.value;
    setEventData({ ...eventData, description: description });
  };
  const priceChangeHandler = (e) => {
    const price = +e.target.value;
    setEventData({ ...eventData, price: price });
  };
  const dateChangeHandler = (e) => {
    const date = new Date(e.target.value).toISOString();
    setEventData({ ...eventData, date: date });
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
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
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Algo falló!");
        }
        return res.json();
      })
      .then((data) => {
        const allEvents = data.data.events;
        setAllEvents(allEvents);
        console.log(allEvents);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const showDetailHandler = (eventId) => {
    const findEventId = allEvents.find((e) => e._id === eventId);
    setSelectedEvent({
      eventState: true,
      eventData: findEventId,
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      {creating && <Backdrop onCancel={modalCancelHandler} />}
      {creating && (
        <Modal
          title="Add event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          dinamicText={"Confirm"}
        >
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              onChange={(e) => {
                titleChangeHandler(e);
              }}
              value={eventData.title}
            />
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              onChange={(e) => {
                priceChangeHandler(e);
              }}
              value={eventData.price || ""}
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-control">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              onChange={(e) => {
                dateChangeHandler(e);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              cols="30"
              rows="10"
              onChange={(e) => {
                descriptionChangeHandler(e);
              }}
              value={eventData.description || ""}
            ></textarea>
          </div>
        </Modal>
      )}

      {selectedEvent.eventState && <Backdrop onCancel={modalCancelHandler} />}
      {selectedEvent.eventState && (
        <Modal
          title="Add event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalBookHandler}
          dinamicText={"Reservar"}
        >
          <div className="form-control">
            <p>{selectedEvent.eventData.title}</p>
          </div>
        </Modal>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {token && (
            <button onClick={startCreateEventHandler}>Add event</button>
          )}
          <ul className="events__list">
            <EventList
              allEvents={allEvents}
              authUserId={context.userId}
              onViewDetail={showDetailHandler}
            />
          </ul>
        </>
      )}
    </div>
  );
}

export default EventsPage;
