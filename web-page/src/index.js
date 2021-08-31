import React, {useEffect, useState,} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Posts, {Single_post} from "./components/Post";
import Home from "./components/home";
import NewPost from "./components/newPost";
import InputWithIcon from './components/login';
import {UserSignup} from "./UserSignup";
import UserLogout from "./UserLogout";
import {UpdatePost} from "./components/Edit_delete";
import {Button, ButtonGroup, Grid} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';
import Add_new_comment from "./components/Add_new_coment";



const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        flexDirection: 'column',
        padding:'1rm',
        border:0,
        marginTop:theme.spacing(0.5),
        '& > *': {
        margin:theme.spacing(0.8)
        },

    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 25,
        height: 25,
        color:"#3f50b5"	,
    },
    root: {
        backgroundColor:"#e0e0e0",
        marginBottom:'10px',
        height:'60px',
        '& > span': {
            margin: theme.spacing(2),
        },
    },
    action:{
      backgroundColor:"#a2a0a0"
    }
}));
function App1() {
    const [login, setLogin] = useState(false);
    const [id, setId] = useState(0);
    useEffect(() => {
        const parsedCount = (localStorage.getItem("login") == 'true')
        setLogin(parsedCount)
    }, [])

    useEffect(() => {
        localStorage.setItem("login", login.toString())
    }, [login])
    const classes = useStyles();
    return (

        <Router>
            <div>
                <div className="title">
                    <Grid className={classes.root}>
                        <ButtonGroup  color="primary">
                            <Button href="/" className={classes.link} id="home" ><HomeIcon className={classes.icon}/></Button>
                            <Button href="/new_post" className={classes.link} id="nan1">New Post</Button>
                            <Button href="/Post" className={classes.link} id="nan2">Posts</Button>

                            {login ? <Button href="/logout" className={classes.link} id="logout" onClick={<UserLogout/>}>Logout</Button> :
                                <Button href="/login" className={classes.link} id="login">Login</Button>}
                            <Button href="/signup" className={classes.link} id="signup">Signup</Button>
                        </ButtonGroup>
                    </Grid>
                </div>
                <Switch>
                    <Route path="/signup">
                        <UserSignup/>
                    </Route>
                    {
                        login ?
                            <Route path="/logout">
                                <UserLogout login={setLogin}/>
                            </Route> :
                            <Route path="/login">
                                <InputWithIcon login={setLogin}/>
                            </Route>
                    }
                    }
                    <Route path="/Edit">
                        <UpdatePost id={id}/>
                    </Route>
                    <Route path="/Post/new_comment">
                        <Add_new_comment id={id}/>
                    </Route>
                    <Route path="/Post/:id">
                        <Single_post id={setId}/>
                    </Route>
                    <Route path="/Post">
                        <Posts data=' '/>
                    </Route>
                    <Route path="/new_post">
                        <NewPost/>
                    </Route>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}


ReactDOM.render(
    <App1/>,
    document.getElementById('root1')
);



reportWebVitals();
