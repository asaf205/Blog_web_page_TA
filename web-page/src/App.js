import React, {useEffect, useState} from "react";
import './App.css';
import {useParams, useHistory} from "react-router-dom";
import {Box, Button, Grid, ListItem, ListItemText, Paper, Typography} from "@material-ui/core";
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Divider from "@material-ui/core/Divider";
import { makeStyles } from '@material-ui/core/styles';


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
        let decodedCookie = a.split('=')[1];

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
        let decodedCookie = a.split('=')[1];
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
                    <ListItem key={props.title}>
                        <ListItemText primary={props.title} secondary={props.text}/>
                    </ListItem>
                    <ListItem key={props.id}>
                        <ListItemText>published on <strong>{props.order}</strong> by {props.author}</ListItemText>

                    </ListItem>
                    <ListItem key={props.author}>
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
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
    },

}));


export function Right(props) {
    const [popularPosts,setPopularPosts] = useState([]);
    const classes = useStyles();
    const history = useHistory();
    let url = '/api/posts/most_popular';
    useEffect(() => {
        return Get_popular_posts(setPopularPosts,url)
    }, []);

    const listItems = popularPosts.map((postItem) =>
        <Box display="flex" justifyContent="center" key={postItem.post_id} className={classes.root} >
            <Paper elevation={3}>
            <ListItem  key={postItem.post_id} button onClick={()=>history.push(`/Post/${postItem.post_id}`)}>
                <ListItemText primary={postItem.title} secondary={postItem.body ? postItem.body.substring(0, 200)+"...." : null}/>
            </ListItem>
            <Divider/>
            </Paper>
        </Box>
    );
    console.log(popularPosts)
    return(<div>
        <Grid style={{textAlign:'center'}} >
            <Typography variant={'h4'} color={"primary"}>POPULAR</Typography>
        </Grid>
            {listItems}
        </div>);

}