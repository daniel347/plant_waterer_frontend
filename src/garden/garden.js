import {Plant} from "../components/plant";
import React from "react";
import {useEffect} from "react";
import './garden.css'
import {AddPlant} from "../components/add_plant_button";
import {getDatabase, ref, child, get, remove, update} from "firebase/database";
import {initializeApp} from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {LoginModal} from "../modals/login_modal";


export function Garden() {
    const [plants, setPlants] = React.useState({});
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [authenticated, setAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState(null);

    const firebaseConfig = {
      apiKey: "AIzaSyBMkmcudKEwkXGguzcNwZCY7md0rGaHf7I",
      authDomain: "plant-waterer-9be5e.firebaseapp.com",
      databaseURL: "https://plant-waterer-9be5e-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "plant-waterer-9be5e",
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    useEffect(() => {
        if (!dataLoaded && authenticated) {
            console.log("Loading data");
            setDataLoaded(true);
            get(child(dbRef, "plants")).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setPlants(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {console.error(error); setDataLoaded(false)});
        }
    }, [dataLoaded, authenticated]);

    const updatePlant = (name, data) => {
        console.log("update");
        console.log(data);
        const plants_clone = structuredClone(plants);
        plants_clone[name] = {...plants_clone[name], ...data};
        update(child(dbRef, "plants/"+name), data);
        console.log(plants_clone);
        setPlants(plants_clone);
    }

    const removePlant = (name) => {
        console.log("remove");
        const plants_clone = structuredClone(plants);
        delete plants_clone[name];
        remove(child(dbRef, "plants/"+name));
        console.log(plants_clone);
        setPlants(plants_clone);
    }

    return (
        <main>
            {!authenticated && <LoginModal setAuthenticated={setAuthenticated} setUser={setUser}/>}
            <h1 className="garden_title">My Garden</h1>
            <div className="garden_container">
                {Object.entries(plants).map((plant) =>
                    <Plant
                        plant_name={plant[0]}
                        data={plant[1]}
                        update={(newData) => {updatePlant(plant[0], newData)}}
                        remove={() => {removePlant(plant[0])}}
                        db_ref={dbRef}/>)}
                <AddPlant add={updatePlant}/>
            </div>
        </main>
    );
}
