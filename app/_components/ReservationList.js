"use client";

import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";

import ReservationCard from "./ReservationCard";

function ReservationList({ bookings }) {
  //  const [OPTIMISTICSTATE/same as the first param, SETTERFN] =  useOptimistic(CURRENTSTATE,UPDATEFN)
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId); // called when button clicked to delete to rerender the page
    await deleteReservation(bookingId); // async fn that will be running in the background
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => ( // in begining optimisticbookings===bookings
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
