import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Button, Typography} from "@material-ui/core";
import "../App.css";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import axios from "axios";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(3),
    },
    Button:{
        backgroundColor:"#3e50b5",
        margin: theme.spacing(3),
        color:"#E0FFFF",
    },
    TextField:{
        margin: theme.spacing(1),
        width:'25%',
        height:'100%',
    },
}));

export let Login = (props)=> {
    const classes = useStyles();
    return (
        <div >
            <Grid
                className={classes.margin}
                container
                direction="column"
                justify="center"
                alignItems="center"
                alignContent="center"
                id = "login"
            >
                <Typography variant={"h1"} className={classes.margin}>Login</Typography>
                <FormControl className={classes.TextField}>
                    <InputLabel htmlFor="input-with-icon-adornment">User Name</InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        placeholder=" User Name"
                        label=" User Name"
                        onChange={props.user}
                        startAdornment={
                            <InputAdornment  position="start">
                                <AccountCircle  />
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <TextField
                    className={classes.TextField}
                    id="input-with-icon-textfield"
                    placeholder="Password"
                    label="Password"
                    type="password"
                    position="center"
                    onChange={props.pass}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button id="loginButton" className={classes.Button} variant="contained" onClick={props.log}>
                    Login
                </Button>
                <div>
                    {props.respons}
                </div>
            </Grid>
        </div>

    )
}

export default function InputWithIcon(props) {
    const [user,setUser] = useState(null);
    const [pass,setPass] = useState(null);
    const [resp,setResp] = useState(null);
    const history = useHistory();
    let changeUser = (e)=>{
        setUser(e.target.value);
    }
    let changePass = (e)=>{
        setPass(e.target.value);
    }
    let doLogin = async ()=>{
      let url = '/api/login';
      let data = {
          user: user,
          pass: pass,
      }

      await axios.post(url,data).then(async (res)=>{

          setResp("Success: user login.");
          await props.login(true);
          history.push('/')

      }).catch((err)=>{
          setResp("Error: failed to login.");
      });

    }
    return (
            <Login respons ={resp?resp:null} user = {changeUser} pass = {changePass} log = {doLogin}/>
        );



}
