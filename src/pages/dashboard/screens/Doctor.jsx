import React, { useState} from 'react';
import '../../../styles/theme.css'
import './doctor.css'
import axios from "axios";
import {useOutletContext} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem, Modal,
    Paper, TablePagination,
    TextField,
    Typography
} from "@mui/material";


const Doctor = ()=> {
    const sideBarVisible = useOutletContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [hospital, setHospital] = useState("Select Hospital")
    const [city, setCity] = useState("Select City")
    const [experience, setExperience] = useState("Select Experience");
    const [licenceNo, setLicenceNo] = useState("");

    const hospitals = [
        { value: "Select Hospital", label: "Select Hospital" },
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
    const experiences = [
        {
            value: "1",
        },
        {
            value: "2"
        },
        {
            value: "3",
        },
        {
            value: "4",
        },
        {
            value: "5",
        },
        {
            value: "5+",
        },
    ]
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editDoctorId, setEditDoctorId] = useState(null);
    const [doctorCount, setDoctorCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if(isEditMode){
            console.log("Update mode is on")
            const doctorRequest = {
                email: email,
                name:name,
                password:password,
                address:address,
                phone:phone,
                hospital:hospital,
                city:city,
                experience:experience,
                specialization:specialization,
                licenceNo:licenceNo
            }
            console.log(doctorRequest)
            try {
                await axios.put(
                    `http://localhost:9091/api/doctors/update-doctor/${editDoctorId}`,
                    doctorRequest,
                    {
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                alert("Doctor Updated completed")
                setIsEditMode(false)
                setLoading(false)
                clearAllFields();
                await fetchDoctors();
            } catch (e) {
                console.log("Failed to update with error "+ e)
            }


        } else {

            setUpdate(false)

            try {
                console.log("Step 1")
                // Step 1: Prepare user data for user-service
                const userRequest = {
                    email: email,
                    name:name,
                    password: password,
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
                const userName = userResponse.data.data.name;

                // Step 3: Prepare doctor data for doctor-service
                const doctorRequest = {
                    userId: userId,
                    name: userName,
                    email: email,
                    phoneNumber: phone,
                    specialization: specialization,
                    experience: experience,
                    hospital: hospital,
                    address: address,
                    licenseNo: licenceNo,
                    city: city
                };
                console.log(doctorRequest)
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
                clearAllFields();

                alert("Doctor registered successfully!");
            } catch (error) {
                setLoading(false)
                console.error("Error creating doctor:", error);
                alert("Doctor registration failed. Please check the data and try again.");
            }
        }

    };
    const countAll = async () => {
        const response = await axios.get("http://localhost:9091/api/doctors/count-all", {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })

        setDoctorCount(response.data.data);
        console.log(response.data.data);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchDoctors(newPage, rowsPerPage); // pass correct params
    };

    const handleChangeRowsPerPage = (event) => {
        const newRows = parseInt(event.target.value, 10);
        setRowsPerPage(newRows);
        setPage(0);
        fetchDoctors(0, newRows); // reset to first page
    };
    const fetchDoctors = async (pageNumber = page, size = rowsPerPage) => {
        setLoading(false);
        setError(null);
        setUpdate(false)
        await countAll();

        try {
            const response = await axios.get('http://localhost:9091/api/doctors/find-all-doctors', {
                params: {
                    searchText: '',
                    page: pageNumber,
                    size: size
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

        setUpdate(false)
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

    const setData = (doc)=>{
        clearAllFields();
        setName(doc.name)
        setSpecialization(doc.specialization)
        setLicenceNo(doc.licenceNo)
        setEmail(doc.email)
        setAddress(doc.address)
        setPhone(doc.phoneNumber)
        setExperience(doc.experience)
        setCity(doc.city)
        setHospital(doc.hospital)
    }
    const editDoctor =(doc)=>{
        setIsEditMode(true);
        setEditDoctorId(doc.doctorId)
        console.log(doc.doctorId);
        clearAllFields();
        setData(doc);
    }



    const clearAllFields = ()=>{
        setUpdate(false)
        setCity("Select City")
        setHospital("")
        setEmail("")
        setName("")
        setLicenceNo("")
        setAddress("")
        setExperience("Select Experience")
        setPassword("")
        setPhone("")
        setSpecialization("")
    }
    return (
            <div className={sideBarVisible ? "collapsed" : "expanded"}>
                <div className="inner doctor">
                    <Box sx={{backgroundColor: "var(--bg-primary)"}} mx="auto" maxWidth={800} mt={5} p={3}>
                        <Typography sx={{color: "var(--text-primary)", fontWeight: "bold"}} variant="h4" mb={2}>Register
                            User</Typography>

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
                                disabled={isEditMode}
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
                                disabled={isEditMode}
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
                                    value={hospital}
                                    onChange={(e) => setHospital(e.target.value)}
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
                                    value={city}
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
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    helperText="Please select experience in years"
                                >
                                    {experiences.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Box>

                                <Button type="submit" onClick={(e)=> handleSubmit(e)} variant="contained" disabled={loading}
                                        sx={{backgroundColor: "var(--accent-color)", marginTop: "10px"}}
                                        fullWidth={true}>{loading ?
                                    <CircularProgress/> : isEditMode ? "Update User" : "Save User"}</Button>

                        </form>
                    </Box>
                    <Button onClick={()=>{
                        setUpdate(false)
                        setIsEditMode(false)
                        setLoading(false)
                        clearAllFields();
                    }}>Create User</Button>

                </div>

                <div className="doc-details">
                    <Box sx={{
                        display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid red"
                    }}>
                        <Button color="success" sx={{marginTop: "20px", marginLeft: "40px"}} onClick={() => fetchDoctors()}
                                variant="contained">Load all doctors</Button>


                        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                        <TablePagination
                            component="div"
                            sx={{
                                mt: 2,
                                '& .MuiTablePagination-toolbar': {
                                    justifyContent: 'space-between',
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                },
                            }}
                            count={doctorCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </Box>
                    </Box>
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
                                    <tr >
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
                                        <td>
                                            <Button color="error" variant='contained' onClick={()=> deleteDoctor(doc.doctorId, doc.userId)}>Delete</Button>
                                            <Button color="info" variant='outlined' onClick={() => editDoctor(doc)}>Edit</Button>
                                        </td>
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

