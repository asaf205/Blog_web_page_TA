import '../App.css';
import React, {useState, useEffect} from 'react';
import {Left} from "../App";
import axios from 'axios';
import {Link, useHistory} from "react-router-dom";
import {

    useParams,
} from "react-router-dom";
import RateReviewIcon from '@material-ui/icons/RateReview';
import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import RadioButtons from "./SearchBar";


let create_obj_list = (data) => {
    let tempPostsData = [];
    for (let post of data) {
        let posts = {
            id: post.post_id,
            title: post.title,
            className: "inner_table",
            classname: "inner_text",
            post: post.post_id,
            order: post.upload_time,
            number: post.post_id,
            author: post.author,
            text: post.body,
            category: post.category,
        }
        tempPostsData.push(posts);
    }
    return tempPostsData;
}

export let Get_posts_by_category = (func,data) => {
    let url = '/api/posts';
    axios.post(url,data).then((results) => {
        console.log(results.data)
        func(results.data);
    })
}
let Posts = (props) => {
    const [Data, setData] = useState(props.data);
    const [Category,setCategory] = useState('All');
    const history = useHistory()
    let filter = {
        category: Category
    }

    useEffect(() => {
        return Get_posts_by_category(setData,filter)
    }, [Category]);
    let post_list = create_obj_list(Data);
    const listItems = post_list.map((postItem) =>
        <div key={postItem.id}>
            <ListItem key={postItem.id} button onClick={()=>history.push(`/Post/${postItem.id}`)}>
                <ListItemText primary={postItem.title} secondary={postItem.text ? postItem.text.substring(0, 200)+"...." : null}/>
            </ListItem>
            <Divider/>
        </div>
    );

    return (
        <div>
            <RadioButtons setCategory = {setCategory}/>
            {listItems}
        </div>)
};
let Get_single_post = async (func, id, func2) => {
    let url = '/api/posts/single';
    let data = {
        post_id:id
    }
    await axios.post(url,data).then((results) => {
        console.log(results)
        func(results.data[0])
    }).then(() => {
        Get_all_comment_per_post(id, func2);
    });
}
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));
let Comment = (props) => {
    const classes = useStyles();

    return (
        <div>
            <ListItem alignItems="flex-start" key={props.comment_id}>
                <ListItemAvatar>
                    <RateReviewIcon/>
                </ListItemAvatar>
                <ListItemText
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {props.name}
                            </Typography>
                            - {props.comment}
                        </React.Fragment>
                    }
                />

            </ListItem>
            <Divider variant="inset" component="li"/>
        </div>
    )
}

let Get_all_comment_per_post = (id, setComments) => {
    let url = '/api/comments';
    let comment_list = []
    axios.get(url).then((results) => {
        for (let i of results.data) {
            console.log(i);
            if (i.post_id == id) {
                comment_list.push(i);
            }
        }
    }).then(() => {
        console.log(comment_list);
        const new_comment_list = comment_list.map((comment) =>
            <Comment comment_id={comment.comment_id} name={comment.name} comment={comment.comment}/>
        );
        setComments(new_comment_list);
    });

}
export let Single_post = (props) => {
        const [single, setSingle] = useState(null);
        const [comments, setComments] = useState(null);
        const classes = useStyles();
        let {id} = useParams();
        console.log(id)
        useEffect(() => {
            return Get_single_post(setSingle, id, setComments);
        }, []);

        console.log(comments)
        if (single === null || comments == null) {
            return 'Loading...';
        }
        const roust = (<div>
            <Left id={single.id} className={"inner_table"} category={single.category} title={single.title}
                  text={single.body}
                  order={single.upload_time} author={single.author} func={props.id}/>
            {comments ? <List className={classes.root}>
                {comments}
            </List> : null}
        </div>);
        return (
            <div>
                {roust}
            </div>)
    }
;
export default Posts;