import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("profile"));

    useEffect(() => {
        if (user != null) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className="flex flex-col pt-12 w-3/4 m-auto">
            <h1 className="text-center text-5xl font-medium m-auto" style={{ width: "65%" }}>
                Easiest invoicing for freelancers and small businesses
            </h1>
            <div className="" style={{ marginTop: "-100px" }}>
                <img
                    src="https://res.cloudinary.com/almpo/image/upload/v1637241441/special/banner_izy4xm.png"
                    alt="invoicing-app"
                />
            </div>
        </div>
    );
};

export default Home;
