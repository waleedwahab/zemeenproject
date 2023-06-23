import React, { useState } from 'react'
import styles from './GoogleMaps2.module.css'

import MapPicker from 'react-google-map-picker'
import GoogleMaps from './GoogleMap';

const DefaultLocation = {
    lat: 30.166556316646023,
    lng: 69.34510000000002
};
const DefaultZoom = 6;

const GoogleMaps2 = ({ closeUpload, locations }) => {

    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    function handleChangeLocation(lat, lng) {
        setLocation({ lat: lat, lng: lng });
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }
    const handleClose = () => {
        locations(location.lat, location.lng)
        closeUpload(false)
    };

    return (
        <>
            <div className={styles.modalBackground} onClick={() => closeUpload(false)}></div>
            <div className={styles.modalContainer}>
                {/* <button onClick={handleResetLocation}>Reset Location</button>
                <label>Latitute:</label><input type='text' value={location.lat} disabled />
                <label>Longitute:</label><input type='text' value={location.lng} disabled />
                <label>Zoom:</label><input type='text' value={zoom} disabled /> */}

                <MapPicker defaultLocation={defaultLocation}
                    zoom={6}
                    mapTypeId="roadmap"
                    style={{
                        maxWidth: "12000px",
                        height: "100%",
                    }}

                    onChangeLocation={handleChangeLocation}
                    apiKey='AIzaSyCjQY4CjdsL-C83_sSbLzP4cwDy8dkSmmY' />
                <button className={styles.button1} onClick={handleClose}>Add</button>
            </div>
                    onChangeZoom={handleChangeZoom}

        </>
    );
}

export default GoogleMaps2