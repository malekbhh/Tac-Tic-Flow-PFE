import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axiosClient from "../../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"; // Import des composants nécessaires

function Calendar() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [userEvents, setUserEvents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State pour la visibilité du Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message pour le Snackbar
  const [openDialog, setOpenDialog] = useState(false); // State pour la visibilité du dialogue
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await axiosClient.get("/events");
        setUserEvents(response.data);
      } catch (error) {
        console.error("Error fetching user events:", error.message);
      }
    };

    fetchUserEvents();
  }, []);

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/events", {
        title: eventTitle,
        start: eventDate,
      });

      console.log("Event created successfully:", response.data);

      setUserEvents((prevEvents) => [...prevEvents, response.data.event]);
      setEventTitle("");
      setEventDate("");
      setOpenSnackbar(true); // Ouvre le Snackbar en cas de création réussie
      setSnackbarMessage("Event created successfully!"); // Message pour le Snackbar
    } catch (error) {
      console.error("Error creating event:", error.message);
    }
  };

  const handleEventDelete = async (eventId, eventTitle) => {
    setOpenDialog(true); // Ouvre le dialogue pour la confirmation de la suppression
    setSnackbarMessage(
      `Are you sure you want to delete the event "${eventTitle}"?`
    ); // Message pour le dialogue
    // Définir les variables eventId et eventTitle dans l'état local pour les utiliser dans handleConfirmDelete
    setEventId(eventId);
    setEventTitle(eventTitle);
  };
  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/events/${eventId}`);
      setUserEvents((prevEvents) =>
        prevEvents.filter((event) => event.id != eventId)
      );
      setOpenSnackbar(true); // Ouvre le Snackbar en cas de suppression réussie
      setSnackbarMessage(`Event "${eventTitle}" deleted.`); // Message pour le Snackbar
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
    setOpenDialog(false); // Ferme le dialogue après confirmation
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-content">
        <b>{eventInfo.timeText}</b>
        <i className="ml-1">{eventInfo.event.title}</i>
        <button
          className="ml-2"
          onClick={() =>
            handleEventDelete(eventInfo.event.id, eventInfo.event.title)
          }
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ width: "80vw", height: "70vh", marginTop: "25px" }}>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"100%"}
        events={userEvents.map((event) => ({
          ...event,
          id: event.id.toString(),
        }))}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
      <div className="w-fit mt-6">
        <h2 className="font-bold">Add an Event</h2>
        <form className="flex gap-4 mt-4" onSubmit={handleEventSubmit}>
          <input
            type="text"
            className="p-2 rounded-full"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            value={eventDate}
            className="p-2 rounded-full w-full"
            onChange={(e) => setEventDate(e.target.value)}
          />
          <button
            className="px-6  bg-slate-800 rounded-full text-white"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>{" "}
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>{snackbarMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleConfirmDelete(eventId, eventTitle)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calendar;
