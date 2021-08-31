import {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import {Button, InputLabel, NativeSelect, OutlinedInput, TextField} from "@material-ui/core";
import React from "react";
import axios from "axios";

export let creatOptions = (options_name_array,select_name)=>{
    let optionList = [<option value={select_name}>{select_name}</option>]
    for (let i of options_name_array){
        optionList.push(<option value={i}>{i}</option>)
    }
    return optionList
}

let Get_single_post = async (setTitle,setBody,setCategory, id) => {
    let url = '/api/posts/single';
    let data = {
        post_id:id
    }
    await axios.post(url,data).then((results) => {
        console.log(results)
        setTitle(results.data[0].title);
        setBody(results.data[0].body);
        setCategory(results.data[0].category);
    });
}
export let options_name_array = ["News","Life Style","Tech"];
export let UpdatePost = (props)=>{
        const [push, setPush] = useState(0);
        const [title, setTitle] = useState("");
        const [body, setBody] = useState(0);
        const [category, setCategory] = useState(0);
        const [resp,setResp] = useState(null);
        useEffect(()=>{
            Get_single_post(setTitle,setBody,setCategory, props.id);
        },[])
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
        console.log(props.id)
        let Submit = () => {
            let url = '/api/edit'
            let data = {
                title: title,
                body: body,
                category: category,
                post_id: props.id,
            };
            axios.post(url, data).then((r) => {
                setPush(0)
            }).catch((e)=>{
                setResp(e)
            });

        }

        if (push === 0) {
            return (
                <div id="newPostRoot">
                    <Button variant="contained" color="primary" onClick={Push} fullWidth>
                        Edit post
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
                            value={title}
                        />
                    </FormControl>
                    <p></p>
                    <TextField id="body" label="Body" variant="outlined" multiline fullWidth rows={30} onChange={getBody} value={body}/>
                    <p></p>
                    <FormControl className={"picText"} size={"small"} required={true} >
                        <NativeSelect
                            id="demo-customized-select-native"
                            value={category}
                            onChange={handleChangeCategory}
                            // input={<BootstrapInput />}
                        >
                            {creatOptions(options_name_array,"category")}
                        </NativeSelect>
                    </FormControl>
                    <Button type={"submit"} variant="contained" color="primary" onClick={Submit} fullWidth>
                        Submit
                    </Button>
                    <div>
                        {resp}
                    </div>
                </form>);
        }

    }
