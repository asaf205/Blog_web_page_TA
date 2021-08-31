import {Right} from '../App';
import React from "react";

import {Grid, Paper} from "@material-ui/core";
import { Typography } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    inner: {
        padding: 20,
    }

}));


export const Home = () => {
    let text = "The MyBlog is a Tech blog founded on 2021 by Asaf Dahan, providing an in depth view of new technology and how it can change our lives.\n" +
        "Here you can find various articles regarding the latest and most innovative technology breakthroughs, for all of you tech savvy out there."
    const classes = useStyles();
    return (
        <div className="content">
        <div className="left_side">
            <Paper elevation={3} className={classes.root} align={"center"} justify={"center"}>
                <Grid item alignItems={"center"} justify={"center"} alignContent={"center"}>
                <Typography variant='h3' color = 'primary' className={classes.inner}>
                    This is MyBlog
                </Typography>
                </Grid>
            </Paper>
            <Grid item alignItems={"center"} justify={"center"} alignContent={"center"}>
            <Typography variant='h5' >
                {text}
            </Typography>
            </Grid>

        </div>
        <div className="right_side">
            <Right className="up" title="Popular" number1="1" first="1" number2="2" second="2"
                   number3="3"
                   third="3"/>
        </div>

    </div>)
}
export default Home;