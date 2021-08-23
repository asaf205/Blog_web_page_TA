import React, {useEffect, useState} from "react";
import './App.css';
import {useParams, useHistory} from "react-router-dom";
import {Button, Grid, ListItem, ListItemText} from "@material-ui/core";
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Divider from "@material-ui/core/Divider";
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import {Get_posts_by_category} from "./components/Post";
let deletePost = async (id) => {
    await axios.post('/api/delete', {post_id: id});
}
export function Left(props) {
    let {id} = useParams()
    let history = useHistory()
    const [postId, setPostId] = useState(id)
    props.func(postId)
    let addComment = () => {
        history.push("/Post/new_comment");
    }

    let CheckAuthForEdit = async () => {
        let a = decodeURIComponent(document.cookie);
        console.log(a);
        let decodedCookie = a.split('; session_id=')[1];

        if (!decodedCookie) {
            return history.push('/login')
        }
        console.log(decodedCookie)
        let url = '/api/check/edit_and_delete_permissions';
        console.log(postId)
        let data = {
            session_id: decodedCookie,
            post_id: postId,
        }
        await axios.post(url, data).then((response) => {
            console.log("after")
            return history.push('/Edit')
        }).catch((err) => {
            return history.push(`/Post/${postId}`)
        })
    }
    let CheckAuthFoDelete = async () => {
        let a = decodeURIComponent(document.cookie);
        console.log(a);
        let decodedCookie = a.split('; session_id=')[1];
        if (!decodedCookie) {
            return history.push('/login')
        }
        console.log(decodedCookie)
        let url = '/api/check';
        console.log(postId)
        let data = {
            session_id: decodedCookie,
            post_id: postId,
        }

        await axios.post(url, data).then(async (response) => {
            await deletePost(id).then(() => {
                return history.push('/post');
            })

        }).catch((err) => {
            return history.push(`/Post/${postId}`);
        })
    }
    return (
        <div>
            <section id={props.id} className={props.className}>
                <div className={props.classname}>
                    <ListItem>
                        <ListItemText primary={props.title} secondary={props.text}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText>published on <strong>{props.order}</strong> by {props.author}</ListItemText>

                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Category: ${props.category}`}/>
                    </ListItem>

                </div>
                <Grid item xs={3}
                      container
                      direction="column"
                      justify="flex-end"
                      alignItems="center">
                    <Button onClick={CheckAuthForEdit}><BorderColorIcon/></Button>
                </Grid>
                <Grid item xs={3}
                      container
                      direction="column"
                      justify="flex-end"
                      alignItems="center">
                    <Button onClick={CheckAuthFoDelete}>
                        <DeleteIcon/>
                    </Button>
                </Grid>
                <Grid item xs={3}
                      container
                      direction="column"
                      justify="flex-end"
                      alignItems="center">
                    <Button onClick={addComment}><AddCommentIcon/></Button>
                </Grid>

            </section>
            <Divider/>
        </div>
    );
}
let  Get_popular_posts = async (setPopularPosts,url)=>{
    await axios.get(url).then((resp)=>{
        setPopularPosts(resp.data)
    }).catch((err)=>{
        console.log(err);
    })
}
export function Right(props) {
    const [popularPosts,setPopularPosts] = useState([]);
    const history = useHistory();
    let url = '/api/posts/most_popular';
    useEffect(() => {
        return Get_popular_posts(setPopularPosts,url)
    }, []);

    const listItems = popularPosts.map((postItem) =>
        <div key={postItem.post_id}>
            <ListItem key={postItem.post_id} button onClick={()=>history.push(`/Post/${postItem.post_id}`)}>
                <ListItemText primary={postItem.title} secondary={postItem.body ? postItem.body.substring(0, 200)+"...." : null}/>
            </ListItem>
            <Divider/>
        </div>
    );
    console.log(popularPosts)
    return(<div>
            <p>POPULAR</p>
            {listItems}
        </div>);

}