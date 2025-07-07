import React, {useState, useEffect} from 'react';
import {Box, Button, MenuItem, TextField, Typography} from "@mui/material";
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const Booking = () => {


    const [enableEditMode, setEnableEditMode] = useState(false);
    const [patient, setPatient] = useState("");
    const [doctor, setDoctor] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [docId, setDocId] = useState("")
    const [docName, setDocName] = useState("")
    const [patId, setPatId] = useState("")
    const [patName, setPatName] = useState("")

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);

    const [bookings, setBookings] = useState([]);


    const fetchPatients = async (setPatients) => {
        try {
            const response = await axios.get("http://localhost:9092/api/patients/find-all-patients",
                {headers:   {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
                    params: {searchText:"", page: 0, size: 1000}}
            );
            const patientNames = response.data.data.patientList.map((p) => ({
                id: p.patientId,
                name: p.name,
            }));
            setPatients(patientNames);
            console.log(patientNames)
        } catch (error) {
            console.log(error)
            setPatients([]);
        }
    };

    const fetchDoctors = async (setDoctors) =>{
        try {
            const response = await axios.get("http://localhost:9091/api/doctors/find-all-doctors",
                {headers:   {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
                    params: {searchText:"", page: 0, size: 1000}}
            );
            const doctorNames = response.data.data.dataList.map((d) => ({
                id: d.doctorId,
                name: d.name,
            }));
            console.log(doctorNames)
            setDoctors(doctorNames);
        } catch (error) {
            console.log(error)
            setDoctors([]);
        }
    }

    const fetchTimeSlots = async (doctorId, date) => {
        try {
            const response = await axios.get(`http://localhost:9093/api/bookings/available-slots/${doctorId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                params: {date: date}
            });
            const slots = response.data.data.map((slot, idx) => ({ id: idx, name: slot }));
            setAvailableSlots(slots);
            return slots;
        } catch (error) {
            console.error("Error fetching time slots:", error);
            return [];
        }


    }

    const clearFields = ()=>{
        setPatient("")
        setTime("")
        setReason("")
        setDoctor("")
        setDocId("")
        setPatId("")
        setPatName("")
        setDocName("")
        setAvailableSlots([])
        setSelectedDate(null);
    }

    useEffect(() => {
        fetchPatients(setPatients);
        fetchDoctors(setDoctors);
    }, []);

    useEffect(() => {
        if (doctor && selectedDate) {
            console.log( "doctor is "+doctor)
            const date = selectedDate.format("YYYY-MM-DD");
            fetchTimeSlots(doctor.id, date);
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDate, doctor]);

    const [availableSlots, setAvailableSlots] = useState([])

    const handleSubmit = async (e)=>{
        const date = selectedDate.format("YYYY-MM-DD")
        setEnableEditMode(false);
        e.preventDefault();
        if (!patient || !doctor || !time || !reason || !selectedDate) {
            alert("Please fill all the fields");
            return;
        }
        if(!enableEditMode){
            const bookingRequest = {
                patientId:patId,
                patientName:patName,
                doctorId:docId,
                doctorName:docName,
                date:date,
                time:time,
                reason:reason,
                status:"PENDING"
            }

            console.log(bookingRequest);

           try {
               const response = await axios.post("http://localhost:9093/api/bookings/create-booking",
                   bookingRequest,
                   {headers: {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}}
               );
               console.log(response.data.data);
               console.log("created")
               await fetchBookings();
               clearFields();
           } catch (e) {
               console.log("Could not create booking ", e)
           }
        }


    }

    const fetchBookings = async ()=>{
        try {
            const response = await axios.get("http://localhost:9093/api/bookings/find-all-bookings",
                {headers: {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
                    params: {searchText:"", page: 0, size: 1000}}
            );
            console.log(response.data.data.bookingList)
            setBookings(response.data.data.bookingList);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return [];
        }
    }

    const deleteBooking = async (booking)=>{
        try {
            const response = await axios.delete(`http://localhost:9093/api/bookings/delete-by-booking-id/${booking.bookingId}`,
                {headers: {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}}
            );
            console.log(response.data);
            await fetchBookings();
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    }
    return(
        <div className="bookings">
            <Box sx={{
                backgroundColor: "var(--bg-primary)",
                display:"flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }} mx="auto" maxWidth={800} mt={5} p={3}>
                <Typography variant="h4">Patient Services</Typography>
                <form style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "100%",
                    marginTop: "1rem"
                }}>
                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        id="outlined-select-experience"
                        select
                        variant="filled"
                        fullWidth
                        label="Patient"
                        value={patName}
                        onChange={(e) => {
                            const selected = patients.find(p => p.name === e.target.value);
                            setPatient(selected);
                            setPatId(selected.id);
                            setPatName(selected.name);
                        }}
                    >
                        {patients.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        sx={{ backgroundColor: "whitesmoke" }}
                        id="outlined-select-experience"
                        select
                        variant="filled"
                        fullWidth
                        label="Doctors"
                        value={docName}
                        onChange={(e) => {
                            const selected = doctors.find(d => d.name === e.target.value);
                            setDoctor(selected);
                            setDocId(selected.id);
                            setDocName(selected.name);
                        }}
                    >
                        {doctors.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>



                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date"
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                            }}
                            disablePast
                            format="YYYY-MM-DD"
                        />
                    </LocalizationProvider>



                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        id="outlined-select-experience"
                        select
                        variant="filled"
                        fullWidth
                        label="Time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        {availableSlots.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        id="outlined-select-experience"
                        variant="filled"
                        fullWidth
                        label="Reason"
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />

                    <Button onClick={(e)=> handleSubmit(e)} type="submit" variant="contained"
                            sx={{width:"100%", outline:"none", border:"none"}}>{enableEditMode ? "Update Appointment" : "Save Appointment"}</Button>
                </form>

            </Box>

            <Box sx={{
                backgroundColor: "var(--bg-primary)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }} mx="auto" maxWidth={1200} mt={5} p={3}>

                <Button onClick={fetchBookings}>see all bookings</Button>


                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Doc Name</th>
                        <th scope="col">Pat Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Status</th>
                        <th scope="col">Reason</th>
                        <th scope="col">Options</th>


                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking, index) => {
                        return (
                            <tr>
                                <td>{index+1}</td>
                                <td>{booking.doctorName}</td>
                                <td>{booking.patientName}</td>
                                <td>{booking.date}</td>
                                <td>{booking.time}</td>
                                <td>{booking.status}</td>
                                <td>{booking.reason}</td>
                                <td>
                                    <Button onClick={()=> deleteBooking(booking)}>Delete</Button>
                                    <Button>Edit</Button>
                                    <Button>Confirm</Button>
                                    <Button>Cancel</Button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>

            </Box>

        </div>

    )
};

export default Booking;