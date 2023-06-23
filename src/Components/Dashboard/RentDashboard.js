import React, { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BathtubIcon from "@mui/icons-material/Bathtub";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import { collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import styles from "./Sell.module.css";
import { Link } from "react-router-dom";

function RentDashboard() {
  const [sellList, setSellList] = useState([]);

  useEffect(() => {
    const fetchSells = async () => {
      const querySnapshot = await getDocs(collectionGroup(db, "rent"));
      const fetchedSells = querySnapshot.docs.map((doc) => doc.data());
      setSellList(fetchedSells);
    };
    fetchSells();
  }, []);

  return (
    <div className={styles.sell_container}>
      {sellList.map((item, index) => (
        <div key={index} className={styles.slick_item}>
          <div className={styles.abc}>
            {/* Map over the images array */}
            {item.images.map((image, i) => (
              <img
                key={i}
                src={image.url}
                alt={`Image ${i + 1} of ${item.images.length}`}
              />
            ))}
            <p className={styles.p}>
              <LocationOnIcon style={{ fontSize: "17px", color: "black" }} />{" "}
              {item.city}
            </p>
            <div className={styles.feature}>
              <span>
                <BedroomParentIcon style={{ fontSize: "15px" }} />{" "}
                {item.bedroom} Bedroom
              </span>
              <span>
                <BathtubIcon style={{ fontSize: "15px" }} /> {item.bathroom}{" "}
                Bathroom
              </span>
            </div>
            <Link to="/user/conversation">
              <button>
                <i className="fas fa-comments"></i> Chat
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RentDashboard;
