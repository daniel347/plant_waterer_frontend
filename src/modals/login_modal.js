import React from "react";
import 'rc-slider/assets/index.css';
import '../components/plant.css';
import './modal.css';
import '../index.css'
import {TextInput} from "../components/text_input";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";


export function LoginModal({setAuthenticated, setUser}) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [instruction, setInstruction] = React.useState("Please log in to continue");
    const [loginFailed, setLoginFailed] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        signIn(data.email, data.password);
    }

    const signIn = (user, pass) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, user, pass)
            .then((userCredential) => {
                // Signed in
                setUser(userCredential.user);
                setAuthenticated(true);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error signing in");
                console.log(errorCode, errorMessage);
                setInstruction("Login failed, please try again");
                setLoginFailed(true);
            });
    };

    return (
        <div>
            <div className="modal_background"/>
            <div className="modal plant_container login_modal_size">
                <form method="post" onSubmit={handleSubmit}>
                    <h2 className="modal_title">Welcome!</h2>
                    <h4 className={loginFailed ? "modal_subtitle error" : "modal_subtitle"}>{instruction}</h4>
                    <div style={{"height": "2rem", "width": "100%"}}/>
                    <TextInput id="email" label="Email" text={email} setText={setEmail}/>
                    <TextInput id="password" label="Password" text={password} setText={setPassword}/>
                    <div/>

                    <button type="submit" className="button">Login</button>
                </form>
            </div>
        </div>
    );
}