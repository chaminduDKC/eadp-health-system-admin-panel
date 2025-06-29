import React, { useState} from 'react';
import '../../../styles/theme.css'
import './doctor.css'
import axios from "axios";
import {useOutletContext} from "react-router-dom";
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, TextField, Typography} from "@mui/material";


const Doctor = ()=> {
    const sideBarVisible = useOutletContext();
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [hospital, setHospital] = useState("")
    const [city, setCity] = useState("")
    const [experience, setExperience] = useState("1");
    const [licenceNo, setLicenceNo] = useState("");

    const hospitals = [
        {
            value: "Matara",
            label: "Matara"
        },
        {
            value: "Galle",
            label: "Galle"
        },
        {
            value: "Colombo",
            label: "Colombo"
        },

    ]
    const cities = [
        {
            value: "Matara",
            city: "Matara",
        },
        {
            value: "Galle",
            city: "Galle",
        },
        {
            value: "Pasgoda",
            city: "Pasgoda",
        },
        {
            value: "Deniyaya",
            city: "Deniyaya",
        },
    ]
    const experiences = ["1", "2", "3", "4", "5", "5+"]
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Step 1")
            // Step 1: Prepare user data for user-service
            const userRequest = {
                email: email,
                firstName: fName,
                lastName: lName,
                password: password,
                // role: "doctor"
            };

            console.log("Step 2")
            console.log(userRequest)
            // Step 2: Send request to user-service
            const userResponse = await axios.post(
                "http://localhost:9090/api/users/register-doctor",
                userRequest,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log(userResponse.data);

            const userId = userResponse.data.data.userId;
            const name = userResponse.data.data.firstName + " " + userResponse.data.data.lastName

            // Step 3: Prepare doctor data for doctor-service
            const doctorRequest = {
                userId: userId,
                name: name,
                email: email,
                phoneNumber: phone,
                specialization: specialization,
                experience: experience,
                hospital: hospital,
                address: address,
                licenseNo: licenceNo,
                city: city
            };

            // Step 4: Send request to doctor-service
            await axios.post(
                "http://localhost:9091/api/doctors/create-doctor",
                doctorRequest,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            await fetchDoctors();

            alert("Doctor registered successfully!");
        } catch (error) {
            console.error("Error creating doctor:", error);
            alert("Doctor registration failed. Please check the data and try again.");
        }
    };


    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:9091/api/doctors/find-all-doctors', {
                params: {
                    searchText: '',
                    page: 0,
                    size: 10
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setDoctors(response.data.data.dataList); // data field StandardResponse
            console.log(doctors)
            console.log(localStorage.getItem("token"))
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const deleteDoctor = async (doctorId, userId)=>{
        try{
            const response = await axios.delete(
           `http://localhost:9091/api/doctors/delete-doctor/${doctorId}`,
           {
               headers:{
                   Authorization:`Bearer ${localStorage.getItem("token")}`
               },
               params:{
                   userId:userId
               }
           }
       )
            console.log(response)
            await fetchDoctors();
        } catch (e){
            console.log(e)
        }
    }

    return (
            <div className={sideBarVisible ? "collapsed" : "expanded"}>
                <div className="inner doctor">
                    <Box sx={{backgroundColor: "var(--bg-primary)"}} mx="auto" maxWidth={800} mt={5} p={3}
                         border="1px solid var(--accent-color)" borderRadius={2}>
                        <Typography sx={{color: "var(--text-primary)", fontWeight: "bold"}} variant="h4" mb={2}>Register
                            User</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                sx={{
                                    backgroundColor: "whitesmoke"
                                }
                                }
                                label="First name"
                                variant="filled"
                                margin="normal"
                                fullWidth
                                required
                                type="text"
                                value={fName}
                                onChange={(e => setFName(e.target.value))}

                            />

                            <TextField
                                sx={{
                                    backgroundColor: "whitesmoke"
                                }
                                }
                                label="Last name"
                                variant="filled"
                                margin="normal"
                                fullWidth
                                required
                                type="text"
                                value={lName}
                                onChange={(e => setLName(e.target.value))}

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
                                label="Password"
                                variant="filled"
                                margin="normal"
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e => setPassword(e.target.value))}

                            />
                            <FormControlLabel control=
                                                  {
                                                      <Checkbox
                                                          sx={{
                                                              backgroundColor: "white",
                                                              marginRight: "10px",
                                                              marginLeft: "10px",
                                                          }}
                                                          checked={showPassword}
                                                          onChange={(e) => setShowPassword(e.target.checked)}/>
                                                  }
                                              label="show password"
                                              sx={{color: "var(--text-primary)"}}

                            />


                            <Box sx={{display: "flex", width: "100%", justifyContent: "space-between", gap: "10px"}}>
                                <TextField
                                    sx={{
                                        // width:"45%",
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
                                        // width:"45%",
                                        backgroundColor: "whitesmoke"
                                    }
                                    }
                                    label="Licence No"
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
                                    required
                                    type="text"
                                    value={licenceNo}
                                    onChange={(e => setLicenceNo(e.target.value))}

                                />

                                <TextField
                                    sx={{

                                        backgroundColor: "whitesmoke"
                                    }
                                    }
                                    fullWidth
                                    label="Specialization"
                                    variant="filled"
                                    margin="normal"

                                    required
                                    type="text"
                                    value={specialization}
                                    onChange={(e => setSpecialization(e.target.value))}

                                />
                            </Box>


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


                            <Box sx={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                gap: "10px",
                                marginTop: "20px"
                            }}>
                                <TextField
                                    sx={{
                                        backgroundColor: "whitesmoke"
                                    }
                                    }
                                    id="outlined-select-hospital"

                                    select
                                    label="Select"
                                    variant="filled"
                                    fullWidth
                                    onChange={(e) => setHospital(e.target.value)}
                                    defaultValue={hospital}
                                    helperText="Please select hospital"
                                >
                                    {hospitals.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    sx={{
                                        backgroundColor: "whitesmoke"
                                    }
                                    }
                                    id="outlined-select-hospital"
                                    select
                                    variant="filled"
                                    fullWidth
                                    label="Select"
                                    defaultValue={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    helperText="Please select city"
                                >
                                    {cities.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.city}
                                        </MenuItem>
                                    ))}
                                </TextField>


                                <TextField
                                    sx={{
                                        backgroundColor: "whitesmoke"
                                    }
                                    }
                                    id="outlined-select-experience"
                                    select
                                    variant="filled"
                                    fullWidth
                                    label="Select"
                                    defaultValue={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    helperText="Please select experience in years"
                                >
                                    {experiences.map((option) => (
                                        <MenuItem>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>


                            </Box>


                            <Button type="submit" variant="contained"
                                    sx={{backgroundColor: "var(--accent-color)", marginTop: "10px"}} fullWidth={true}>Save
                                User</Button>
                        </form>
                    </Box>

                </div>

                <div className="doc-details">
                    <Button color="success" sx={{marginTop: "20px", marginLeft: "40px"}} onClick={() => fetchDoctors()}
                            variant="contained">Load all doctors</Button>
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
                                <th scope="col">Phone</th>
                                <th scope="col">City</th>
                                <th scope="col">Experience</th>
                                <th scope="col">Address</th>
                                <th scope="col">Hospital</th>
                                <th scope="col">Specialization</th>
                                <th scope="col">Status</th>
                                <th scope="col">Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {doctors.map((doc, index) => {
                                return (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{doc.name}</td>
                                        <td>{doc.email}</td>
                                        <td>{doc.phoneNumber}</td>
                                        <td>{doc.city}</td>
                                        <td>{doc.experience}</td>
                                        <td>{doc.address}</td>
                                        <td>{doc.hospital}</td>
                                        <td>{doc.specialization}</td>
                                        <td>{doc.status ? "Online" : "Offline"}</td>
                                        <td><Button color="error" variant='contained' onClick={()=> deleteDoctor(doc.doctorId, doc.userId)}>Delete</Button></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </Box>
                </div>

            </div>
        )
    }

export default Doctor;