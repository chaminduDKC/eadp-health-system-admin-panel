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
    const [age, setAge] = useState();
    const [password, setPassword] = useState("");


    const genders = [
        "Male","Female","Other"
    ]


    const handleSubmit = async (e)=>{
        e.preventDefault();
        const request = {
            name:name,
            email:email,
            password:password,
            address:address,
            phone:phone,
            gender:gender,
            age:age
        };

        // const patientRequest = {
        //     name:name,
        //     email:email,
        //     password:password,
        //     address:address,
        //     phone:phone,
        //     gender:gender,
        //     age:age
        // }

        console.log(request);

        try {

            console.log("Started")
            const response = await axios.post("http://localhost:9090/api/users/register-patient",
                request, {headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});

            console.log(response.data.data)
            console.log("Completed")
        } catch (e) {
            console.log(e)
        }

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
                    <Button onClick={(e)=> handleSubmit(e)} type="submit" variant="contained" sx={{width:"100%", outline:"none", border:"none"}}>Save Patient</Button>
                </form>
            </Box>
        </div>
    )
};

export default Patient;