import {Right} from '../App';
import React from "react";
import Posts from "./Post";
import {ListItem, ListItemText} from "@material-ui/core";
import { Typography } from '@material-ui/core';
export const Home = () => {
    let text = "The MyBlog is a Tech blog founded on 2021 by Asaf Dahan, providing an in depth view of new technology and how it can change our lives.\n" +
        "Here you can find various articles regarding the latest and most innovative technology breakthroughs, for all of you tech savvy out there."
    return (
        <div className="content">
        <div className="left_side">
            <Typography variant='h3' color = 'primary'>
                This is MyBlog
            </Typography>
            <Typography variant='h6' >
                {text}
            </Typography>

        </div>
        <div className="right_side">
            <Right className="up" title="Popular" number1="1" first="1" number2="2" second="2"
                   number3="3"
                   third="3"/>
        </div>

    </div>)
}
export default Home;