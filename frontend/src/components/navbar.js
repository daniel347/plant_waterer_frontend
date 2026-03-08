import React from "react";
import "./navbar.css";

export function Navbar({headings, open_page, set_open_page}) {

    return (
        <div className="navbar_container">
            <div className="navbar">
                {headings.map((h)=>(<h3 className={open_page == h ? "header header_active" : "header"}
                                        onClick={(event) => set_open_page(event.currentTarget.id)}
                                        id={h}>
                                            {h}
                                        </h3>)
                            )}
            </div>
            <hr className="rule"/>
        </div>
    )
}