import React, {useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(3),
    },
    Button: {
        backgroundColor: "#8FBC8B",
        margin: theme.spacing(3),
        color: "#E0FFFF",
    },
}));

export default function UserLogout(props) {
    let classes = useStyles();
    const [resp, setResp] = useState(null);
    let doLogout = async () => {
        let url = '/api/logout';
        await axios.post(url, "").then( async (res) => {
            setResp("Success: user logout.");
            await props.login(false);
        }).catch(async (err) => {
            setResp("Error: failed to logout.");
        })
    }
    return (
            <div>
                <Grid
                    container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Button id='logoutButton' className={classes.Button} variant="contained"
                            onClick={doLogout}>Logout</Button>
                    <div>
                        {resp ? resp : null}
                    </div>
                </Grid>
            </div>)
}
