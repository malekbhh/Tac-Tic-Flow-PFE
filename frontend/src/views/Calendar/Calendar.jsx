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
} from "@mui/material";
import EventForm from "./EventForm";
function Calendar() {
  const [userEvents, setUserEvents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
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

  const handleEventSubmit = async ({ title, start, end }) => {
    try {
      const response = await axiosClient.post("/events", {
        title,
        start,
        end,
      });

      setUserEvents((prevEvents) => [...prevEvents, response.data.event]);
      setOpenSnackbar(true);
      setSnackbarMessage("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error.message);
    }
  };

  const handleEventDelete = async (eventId, eventTitle) => {
    setOpenDialog(true);
    setSnackbarMessage(
      `Are you sure you want to delete the event "${eventTitle}"?`
    );
    setEventId(eventId);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/events/${eventId}`);
      setUserEvents((prevEvents) =>
        prevEvents.filter((event) => event.id != eventId)
      );
      setOpenSnackbar(true);
      setSnackbarMessage(`Event deleted.`);
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
    setOpenDialog(false);
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
      <div className="w-full mt-6">
        <EventForm onSubmit={handleEventSubmit} />
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
          <Button onClick={() => handleConfirmDelete(eventId)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calendar;
