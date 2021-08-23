import React, {useEffect, useState,} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter as Router,
    Switch,
    Route, Link, useLocation
} from "react-router-dom";
import Posts, {Single_post} from "./components/Post";
import Home from "./components/home";
import NewPost from "./components/newPost";
import InputWithIcon from './components/login';
import {UserSignup} from "./UserSignup";
import UserLogout from "./UserLogout";
import {UpdatePost} from "./components/Edit_delete";
import {Breadcrumbs} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';
import Add_new_comment from "./components/Add_new_coment";
const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        color:"#3f50b5"	,
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 25,
        height: 25,
        color:"#3f50b5"	,
    },
    root: {
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
                    <section className="table">
                        <Breadcrumbs aria-label="breadcrumb" className={classes.link}>
                            <Link to="/" className={classes.link}id="home" ><HomeIcon className={classes.icon}/></Link>
                            <Link to="/new_post" className={classes.link} id="nan1">New Post</Link>
                            <Link to="/Post" className={classes.link} id="nan2">Posts</Link>

                            {login ? <Link to="/logout" className={classes.link} id="logout">Logout</Link> :
                                <Link to="/login" className={classes.link} id="login">Login</Link>}
                            <Link to="/signup" className={classes.link} id="signup">Signup</Link>
                        </Breadcrumbs>
                    </section>
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


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
