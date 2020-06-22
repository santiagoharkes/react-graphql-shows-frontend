import React from 'react'

const bookingList = props => (
    <ul>
        {props.booking.map(booking => {
            return (
                <li key={booking._id}>
                    <div>
                        <p>{booking.event.title}</p>
                        <p>{booking.user.email}</p>
                    </div>
                    <div>
                        <button onClick={() => props.onDelete(booking._id)}>Cancel</button>
                    </div>
                </li>
            )
        })}
    </ul>
)

export default bookingList