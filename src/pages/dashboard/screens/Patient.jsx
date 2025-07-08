import React, {useState} from 'react';
import '../../../styles/theme.css'
import './patient.css'
import {Box, Button, MenuItem, TextField, Typography} from "@mui/material";
import axios from "axios";



const Patient = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null);
    const [password, setPassword] = useState("");


    const genders = [
        "Male","Female","Other"
    ]

    const [patients, setPatients] = useState([])

    const [enableEditMode, setEnableEditMode] = useState(false)
    const [updateUserId, setUpdateUserId] = useState("")

    const handleSubmit = async (e)=>{
        if(!name || !email || !address || !phone || !gender || !age || !password){
            alert("Please fill all the required fields");
            return;
        }

        e.preventDefault();

        if(enableEditMode){
            const updateRequest = {
                name:name,
                email:email,
                address:address,
                password:password,
                phone:phone,
                gender:gender,
                age:age
            };

            try{

                const response = await axios.put(`http://localhost:9090/api/users/update-user/${updateUserId}`,
                    updateRequest, {headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});

                console.log("response for update \n "+response.data.code)
            } catch (e) {
                console.log(e)
            }
        } else{
        const request = {
            name:name,
            email:email,
            password:password,
            address:address,
            phone:phone,
            gender:gender,
            age:age
        };
        
        console.log(request);
        try {
            console.log("Started")
            const response = await axios.post("http://localhost:9090/api/users/register-patient",
                request, {headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});

            console.log(response.data.data)
            console.log("Completed")
            await fetchPatients()
            await clearFields();
        } catch (e) {
            console.log(e)
        }
        }

    }

    const fetchPatients = async ()=>{
        try {
            const response = await axios.get("http://localhost:9092/api/patients/find-all-patients", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params:{
                    searchText:"",
                    page:0,
                    size:10
                }
            });
            setPatients(response.data.data.patientList);
            console.log(response.data.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    }

    const deletePatient = async (userId) => {
        console.log("delete called with id "+userId)
        console.log(userId)

        const response = await axios.delete(`http://localhost:9090/api/users/delete-user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        console.log(response)
        if(response.status === 204){
            alert("Patient deleted successfully");
            await fetchPatients();
        }
    }

    const editPatient = async (patient)=>{
        await clearFields();
        setData(patient);
        console.log("Edit called with "+ patient.address)
        setEnableEditMode(true);
        setUpdateUserId(patient.userId);

    }
    const setData = (patient)=>{
        setName(patient.name);
        setEmail(patient.email);
        setAddress(patient.address);
        setPhone(patient.phone);
        setPassword("");
    }

    const clearFields = async () => {
        setGender(null);
        setEmail("");
        setPhone("");
        setName("");
        setAge("");
        setAddress("")
        setPassword("");
    }
    return(
        <div className="patient">

            <Box sx={{backgroundColor: "var(--bg-primary)"}} mx="auto" maxWidth={800} mt={5} p={3}>
                <Typography variant="h4">Patient Services</Typography>
                <form>
                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        label="Name"
                        variant="filled"
                        margin="normal"
                        fullWidth
                        required
                        type="text"
                        value={name}
                        onChange={(e => setName(e.target.value))}

                    />

                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        label="Email"
                        variant="filled"
                        margin="normal"
                        fullWidth
                        required
                        type="email"
                        value={email}
                        onChange={(e => setEmail(e.target.value))}

                    />

                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        label="Address"
                        variant="filled"
                        margin="normal"
                        fullWidth
                        required
                        type="text"
                        value={address}
                        onChange={(e => setAddress(e.target.value))}

                    />

                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        label="Password"
                        variant="filled"
                        margin="normal"
                        fullWidth
                        required
                        type="password"
                        value={password}
                        onChange={(e => setPassword(e.target.value))}

                    />

                    <Box sx={{display:"flex", alignItems:"center", gap:2, flexDirection:{xs:"column", sm:"row"}}}>
                    <TextField
                        sx={{
                            backgroundColor: "whitesmoke"
                        }
                        }
                        label="Phone"
                        variant="filled"
                        margin="normal"
                        fullWidth
                        required
                        type="text"
                        value={phone}
                        onChange={(e => setPhone(e.target.value))}

                    />

                        <TextField
                            sx={{
                                backgroundColor: "whitesmoke"
                            }
                            }
                            id="outlined-select-experience"
                            select
                            variant="filled"
                            fullWidth
                            label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            {genders.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            sx={{
                                backgroundColor: "whitesmoke"
                            }
                            }
                            label="Age"
                            variant="filled"
                            margin="normal"
                            fullWidth
                            required
                            type="number"
                            value={age}
                            onChange={(e => setAge(e.target.value))}

                        />
                    </Box>
                    <Button onClick={(e)=> handleSubmit(e)} type="submit" variant="contained"
                            sx={{width:"100%", outline:"none", border:"none"}}>{enableEditMode ? "Update Patient" : "Save Patient"}</Button>
                </form>
            </Box>




            <Button onClick={()=> fetchPatients()}>Load patients</Button>
            <Box sx={{
                marginLeft: "40px",
                marginTop: "20px"
            }}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Age</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Options</th>


                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((pat, index) => {
                        return (
                            <tr key={index} >
                                <td>{index+1}</td>
                                <td>{pat.name}</td>
                                <td>{pat.email}</td>
                                <td>{pat.address}</td>
                                <td>{pat.gender}</td>
                                <td>{pat.age}</td>
                                <td>{pat.phone}</td>
                                <td>
                                    <Button color="error" variant='contained' onClick={()=> deletePatient(pat.userId)}>Delete</Button>
                                    <Button color="info" variant='outlined' onClick={() => editPatient(pat)}>Edit</Button>
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

export default Patient;