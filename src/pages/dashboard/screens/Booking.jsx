import React, {useState, useEffect} from 'react';
import {Box, Button, MenuItem, TextField, Typography} from "@mui/material";
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
// import {DemoContainer} from "@mui/x-date-pickers/internals/demo/index.js";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
    const [doctors, setDoctors] = useState([])

    const [selectedDate, setSelectedDate] = React.useState(null);


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
        setSelectedDate(dayjs());
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
               clearFields();
           } catch (e) {
               console.log("Could not create booking ", e)
           }
        }


    }
    return(
        <div className="bookings">
            <Box sx={{backgroundColor: "var(--bg-primary)"}} mx="auto" maxWidth={800} mt={5} p={3}>
                <Typography variant="h4">Patient Services</Typography>
                <form>
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
        </div>

)};

export default Booking;