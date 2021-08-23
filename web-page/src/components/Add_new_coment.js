import React, {useState} from "react";
import {Button, InputLabel, OutlinedInput, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import {useHistory} from "react-router-dom";

let Add_new_comment = (props)=>{
    const [push, setPush] = useState(1);
    const [name, setName] = useState("");
    const [comment, setComment] = useState(0);
    const [resp,setResp] = useState(null);
    const history = useHistory()
    let getName = (e) => {
        setName(e.target.value);
    }
    let getComment = (e) => {
        setComment(e.target.value);
    }
    let Submit = async () => {
        let url = "/api/add_new_comment"
        let data = {
            name: name,
            comment: comment,
            post_id: props.id,
        };
        await axios.post(url, data).then((r) => {
            history.push(`/Post/${props.id}`)
        }).catch((e) => {
            setResp(e)
        });
    }
    return(<form noValidate autoComplete="off">
            <FormControl  fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Name</InputLabel>
                <OutlinedInput
                    id="name"
                    labelWidth={60}
                    onChange={getName}

                />
            </FormControl>
            <p></p>
            <TextField id="comment" label="comment" variant="outlined" multiline fullWidth rows={30} onChange={getComment}/>
            <Button type={"submit"} variant="contained" color="primary" onClick={Submit} fullWidth>
                Submit
            </Button>
            <div>
                {resp}
            </div>
        </form>);

}
export default Add_new_comment;