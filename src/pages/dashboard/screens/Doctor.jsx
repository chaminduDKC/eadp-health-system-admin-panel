import React, {useState} from 'react';
import '../../../styles/theme.css'
import './doctor.css'
import {useOutletContext} from "react-router-dom";
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, TextField, Typography} from "@mui/material";


const Doctor = ()=>{
    const sideBarVisible = useOutletContext();
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const hospitals = [
        {
            value:1,
            label:"Matara"
        },
        {
            value:2,
            label:"Galle"
        },
        {
            value:3,
            label:"Colombo"
        },

    ]
    const cities = [
        {
            value:1,
            city:"Matara",
        },
        {
            value:2,
            city:"Galle",
        },
        {
            value:3,
            city:"Pasgoda",
        },
        {
            value:4,
            city:"Deniyaya",
        },
    ]
    // add a note * user service inputs
                // doc inputs
                // pat inputs
                // responses should include user id and other all data
    const doctorData = [
        {
            id:1,
            fName:"Chamindu",
            lName:"Dislshan",
            email:"chamindud061@gmail.com",
            hospital:"Matara",
            specialization:"Cardiologist",
            status:true
        },
        {
            id:1,
            fName:"Chamindu",
            lName:"Dislshan",
            email:"chamindud061@gmail.com",
            hospital:"Matara",
            specialization:"Cardiologist",
            status:true
        },
        {
            id:1,
            fName:"Chamindu",
            lName:"Dislshan",
            email:"chamindud061@gmail.com",
            hospital:"Matara",
            specialization:"Cardiologist",
            status:true
        },
    ]
    return(
        <div className={sideBarVisible ? "collapsed" : "expanded"}>
           <div className="inner doctor">
               <Box sx={{backgroundColor:"var(--bg-primary)"}} maxWidth={500} ml={5} mt={5} p={3} border="1px solid var(--accent-color)" borderRadius={2}>
                   <Typography sx={{color:"var(--text-primary)", fontWeight:"bold"}} variant="h4" mb={2}>Register User</Typography>
                   <form >
                       <TextField
                           sx={{
                               backgroundColor:"whitesmoke"
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
                               backgroundColor:"whitesmoke"
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
                               backgroundColor:"whitesmoke"
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
                               backgroundColor:"whitesmoke"
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
                                   backgroundColor:"white",
                                   marginRight:"10px",
                                   marginLeft:"10px",
                               }}
                               checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}/>
                       }
                                         label="show password"
                                         sx={{color:"var(--text-primary)"}}

                       />
                       <Button type="submit" variant="contained" sx={{backgroundColor:"var(--accent-color)", marginTop:"10px"}} fullWidth={true}>Save User</Button>
                   </form>
              </Box>

               <Box sx={{backgroundColor:"var(--bg-primary)"}} maxWidth={1000} ml={5} mt={5} p={3} border="1px solid var(--accent-color)" borderRadius={2}>
                   <Typography sx={{color:"var(--text-primary)", fontWeight:"bold"}} variant="h4" mb={2}>Complete doctor details</Typography>
                   <form >
                       <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", gap:"10px"}}>
                       <TextField
                           sx={{
                               // width:"45%",
                               backgroundColor:"whitesmoke"
                           }
                           }
                           label="Phone"
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

                               backgroundColor:"whitesmoke"
                           }
                           }
                           fullWidth
                           label="City"
                           variant="filled"
                           margin="normal"

                           required
                           type="text"
                           value={email}
                           onChange={(e => setEmail(e.target.value))}

                       />
                       </Box>
                       <TextField
                           sx={{
                               backgroundColor:"whitesmoke"
                           }
                           }
                           label="Address"
                           variant="filled"
                           margin="normal"
                           fullWidth
                           required
                           type="text"
                           value={lName}
                           onChange={(e => setLName(e.target.value))}

                       />


                       <Box sx={{display:"flex", width:"100%", justifyContent:"space-between", gap:"10px", marginTop:"20px"}}>
                           <TextField
                               sx={{
                                   backgroundColor:"whitesmoke"
                               }
                               }
                               id="outlined-select-hospital"

                               select
                               label="Select"
                               variant="filled"
                               fullWidth
                               defaultValue="Colombo"
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
                                   backgroundColor:"whitesmoke"
                               }
                               }
                               id="outlined-select-hospital"
                               select
                               variant="filled"
                               fullWidth
                               label="Select"
                               defaultValue="Colombo"
                               helperText="Please select city"
                           >
                               {cities.map((option) => (
                                   <MenuItem key={option.value} value={option.value}>
                                       {option.city}
                                   </MenuItem>
                               ))}
                           </TextField>
                       </Box>

                       <Button type="submit" variant="contained" sx={{backgroundColor:"var(--accent-color)", marginTop:"10px"}} fullWidth={true}>Save details</Button>
                   </form>
               </Box>

           </div>

            <div className="doc-details">
                <Button color="success" sx={{marginTop:"20px", marginLeft:"40px"}} variant="contained">Load all doctors</Button>
                <Box sx={{
                    marginLeft:"40px",
                    marginTop:"20px"
                }}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Hospital</th>
                        <th scope="col">Specialization</th>
                        <th scope="col">Status</th>
                        <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {doctorData.map(doc => {
                        return (
                            <tr>
                                <td>{doc.id}</td>
                                <td>{doc.fName}</td>
                                <td>{doc.lName}</td>
                                <td>{doc.email}</td>
                                <td>{doc.hospital}</td>
                                <td>{doc.specialization}</td>
                                <td>{doc.status ? "Online" : "Offline"}</td>
                                <td><Button color="error" variant='contained'>Delete</Button></td>
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