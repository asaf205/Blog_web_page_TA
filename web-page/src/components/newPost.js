import React, {useState} from "react";
import {Button, InputLabel, NativeSelect, OutlinedInput, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {creatOptions, options_name_array} from "./Edit_delete";


export let CheckAuthForEdit = async (history,setUser_id) => {
    let a = decodeURIComponent(document.cookie);
    console.log(a);
    let decodedCookie = a.split('=')[1];
    console.log(decodedCookie);
    if (!decodedCookie) {
        return history.push('/login')
    }
    console.log(decodedCookie)
    let url = '/api/check/login';

    let data = {
        session_id: decodedCookie,
    }
    await axios.post(url, data).then((response) => {
        console.log(response.data.user_id);
        return setUser_id(response.data.user_id);
    }).catch((err) => {
        return history.push('/login')
    })
}
let NewPost = () => {
    const [push, setPush] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState(0);
    const [category, setCategory] = useState(0);
    const [resp,setResp] = useState(null);
    const [user_id,setUser_id] = useState(null);
    let history = useHistory();
    CheckAuthForEdit(history,setUser_id);
    console.log(user_id);
    let Push = () => {
        setPush(1)
    }
    let getTitle = (e) => {
        setTitle(e.target.value);
    }
    let getBody = (e) => {
        setBody(e.target.value);
    }
    let handleChangeCategory = (e) => {
        setCategory(e.target.value);
    }
    let Submit = () => {
        let url = "/api/newPost"
        let data = {
            title: title,
            body: body,
            category: category,
            author_id: user_id,
        };
        axios.post(url, data).then((r) => {
                setPush(0)
        }).catch((e)=>{
            setResp(e)
        });

    }
    console.log(push)
    if (push === 0) {
        return (
            <div id="newPostRoot">
                <Button variant="contained" color="primary" onClick={Push} fullWidth>
                    Add new post
                </Button>
            </div>
        )
    } else {
        return (
            <form noValidate autoComplete="off">
                <FormControl  fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Title</InputLabel>
                    <OutlinedInput
                        id="title"
                        labelWidth={60}
                        onChange={getTitle}

                    />
                </FormControl>
                <p></p>
                <TextField id="body" label="Body" variant="outlined" multiline fullWidth rows={30} onChange={getBody}/>
                <p></p>
                <FormControl className={"picText"} size={"small"} required={true} >
                    <NativeSelect
                        id="demo-customized-select-native"
                        value={category}
                        onChange={handleChangeCategory}
                    >
                        {creatOptions(options_name_array,"category")}
                    </NativeSelect>
                </FormControl>
                <p></p>
                <Button type={"submit"} variant="contained" color="primary" onClick={Submit} fullWidth>
                    Submit
                </Button>
                <div>
                    {resp}
                </div>
            </form>);
    }

}
export default NewPost;