// import React, { useState, useEffect } from "react";
// import firebase from "firebase/compat/app";
// import "firebase/compat/database";

// const firebaseConfig = {
//   // Replace with your Firebase project config
// };

// firebase.initializeApp(firebaseConfig);
// const database = firebase.getDatabase();

// const HotelSearch = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     if (!searchTerm) return;
//     const dbRef = firebase.ref(database, "hotels");
//     dbRef
//       .orderByChild("name")
//       .startAt(searchTerm)
//       .endAt(`${searchTerm}\uf8ff`)
//       .once("value")
//       .then((snapshot) => {
//         const hotelsObj = snapshot.val();
//         const hotelsArr = Object.keys(hotelsObj).map((key) => ({
//           id: key,
//           ...hotelsObj[key],
//         }));
//         setSearchResults(hotelsArr);
//       });
//   }, [database, searchTerm]);

//   const handleSearchTermChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div>
//       <h2>Search Hotels</h2>
//       <input
//         type="text"
//         placeholder="Search hotels by name"
//         value={searchTerm}
//         onChange={handleSearchTermChange}
//       />
//       {searchResults.length > 0 ? (
//         <ul>
//           {searchResults.map((hotel) => (
//             <li key={hotel.id}>
//               <img src={hotel.photoUrl} alt={hotel.name} />
//               <h3>{hotel.name}</h3>
//               <p>Price: {hotel.price}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No results found.</p>
//       )}
//     </div>
//   );
// };

// export default HotelSearch;
