import React, { useState } from "react";
import UserNavbar from "../Navbar/UserNavbar";
import styles from "./UserDashboard.module.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import GoogleMaps from "../Maps/GoogleMap";
import GoogleMaps2 from "../Maps/GoogleMaps2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import BathtubIcon from "@mui/icons-material/Bathtub";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import SellDashboard from "./SellDashboard";
import RentDashboard from "./RentDashboard";
import SearchComponent from "./SearchComponent";

function UserDashboard() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };
  const [data , setdata] = useState("");

  const searchdata = (e)=>
  {
    setdata(e.target.value)
    console.log(e.target.value)
  }
  const searchbtn = ( )=>{
    fetch(`http://192.168.43.127:5000/recommend/${data}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error: ' + response.status);
    }
  })
  .then(data => {
    // Process the received data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });
  }
  const SliderData = [
    {
      image:
        "https://images.unsplash.com/photo-1546768292-fb12f6c92568?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1489&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475189778702-5ec9941484ae?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1351&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const CssTextField = styled(TextField)({
    input: {
      color: "white",
      "&::placeholder": {
        opacity: 1,
      },
    },
    label: { color: "white" },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  });

  return (
    <div className={styles.Main}>
      <UserNavbar />
      <div className={styles.img}>
        <div className={styles.search}>
          <CssTextField
            id="custom-css-outlined-input"
            fullWidth
            sx={{
              borderRadius: "6px",
              fontFamily: " font-family: Poppins, sans-serif;",
            }}
            label="Content Based Search"
            variant="outlined"

            
          />
        <input type="search"     onChange={searchdata} id="searchInput" placeholder="Search..." />

          <button  onClick={searchbtn}>Search</button>
        </div>
      </div>

      <div className={styles.aaa}>
        <div className={styles.slider}>
          <h2>
            Hot Listing <span className={styles.hh}>🔥</span>
          </h2>
          <Slider {...settings}>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://architecturebeast.com/wp-content/uploads/2018/04/Simple-modern-house-with-an-amazing-floating-stairs-Architecture-Beast-33-main-min.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/XLIl7bniDtQ-zx8o_9R-wgmAsHE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/MaydanArchitects2-7d8ed56fa3a846e08130ac68bf41267d.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/uYobv04JAzweRmKAceORrM6ycUs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/1369-03-copy-1b6760fab1984e4393ca4082b2780c7c.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/TUFH7cxIFbCymov0SeRu1ZX-bPQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/IMG_1266-1240x827-740d518231c54b98bd6316437e9408d3.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/5nIJnosgE-8xlolwB8bLZNQhrOM=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/MaydenArchitects-578f1bca194b4d0aaeabdb8695673130.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/qfc13qpHnxMkqp8Ja-XwYjC1JQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/SuCasaDesign-Modern-9335be77ca0446c7883c5cf8d974e47c.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.slick_item}>
              <div className={styles.abc}>
                <img src="https://www.mydomaine.com/thmb/8Gqt3pK0zRXK9dJ9kHl-7AUaEeo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/SuCasaDesign-Modern2-ec89013bd4d74c6693f8247eee10134b.jpg" />
                <p className={styles.p}>
                  <LocationOnIcon
                    style={{ fontSize: "17px", color: "black" }}
                  />{" "}
                  Islamabad, Pakistan
                </p>
                <div className={styles.feature}>
                  <span>
                    <BedroomParentIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                  <span>
                    <BathtubIcon style={{ fontSize: "15px" }} /> 2 Bedroom
                  </span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      <div className="sell">
        <h6>Selling List</h6>
        <SellDashboard />
      </div>
      <div className="sell">
        <h6>Rent List</h6>
        <RentDashboard />
      </div>
    </div>
  );
}

export default UserDashboard;
