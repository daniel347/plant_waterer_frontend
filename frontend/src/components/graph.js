import {
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis
} from "recharts";
import React, {useEffect} from "react";
import {onValue, child} from "firebase/database";

export function Graph({db_ref, last_watered_ref, plant_name}) {
    var style = window.getComputedStyle(document.body);
    const [data, setData] = React.useState([]);
    const [lastWatered, setLastWatered] = React.useState(null);
    const [showGraph, setShowGraph] = React.useState(false);

    const data_type = "moisture";  // temporary fix
    const y_name = data_type === "moisture" ? "Soil Moisture" : data_type === "tray" ? "Tray Full" : "Unknown";
    const data_ref = child(db_ref, 'sensor/' + plant_name + '/' + data_type);
    // hello its me

    useEffect(() => {
        onValue(data_ref, (snapshot) => {
            console.log("Data updated");
            console.log(snapshot.val());
            const new_data = snapshot.val();
            if (new_data === null) {
                setData([]);
                return;
            }
            const curr_time = Date.now() / 1000;
            const plot_data = new_data.map((datum) => {
                return {x: (datum.t - curr_time) / 3600, y: datum.v}
            });
            setShowGraph(plot_data.length > 0)
            setData(plot_data);
        });
        onValue(child(db_ref, 'plants/' + plant_name + '/last_watered'), (snapshot) => {
            console.log("Last watered updated");
            console.log();

            const curr_time = Date.now() / 1000;
            const last_watered = (snapshot.val() - curr_time) / 3600
            setLastWatered(last_watered);
        });
    }, []);

    //


    return (
        <div>
            {showGraph && <ResponsiveContainer width={400} height={200}>
                <ScatterChart margin={{top: 20, right: 20, bottom: 20 }}
                    >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="time past" unit="h" allowDecimals={false} />
                    <YAxis type="number" dataKey="y" name={y_name} unit="%" />
                    <ReferenceLine x={lastWatered} stroke={style.getPropertyValue('--secondary-colour')} label="Last Watered" />
                    <ZAxis type="number" range={[100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name={y_name} data={data} fill={style.getPropertyValue('--primary-colour')} line shape="circle" />
                </ScatterChart>
            </ResponsiveContainer>}
        </div>
    );
}
