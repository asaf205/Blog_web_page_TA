import React from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";

export default function UserLogout(props) {
    const history = useHistory();
    let doLogout = async () => {
        let url = '/api/logout';
        await axios.post(url, "").then( async (res) => {
            await props.login(false);
            history.push('/')
        }).catch(async (err) => {
        })
    }
    doLogout();
    return (null)
}
