import React, { useEffect, useState } from 'react'
import GoogleMaps2 from '../Maps/GoogleMaps2'
import UserNavbar from '../Navbar/UserNavbar'
import styles from './Rent.module.css'
import image from './../../Assets/property.png'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box } from '@mui/system'
import { Button, Input, InputAdornment, OutlinedInput } from '@mui/material'
import GoogleMaps from '../Maps/GoogleMap'
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { Storage } from '../../Auth/firebase'
import { toast } from 'react-toastify';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc, GeoPoint } from 'firebase/firestore';
import { db } from '../../Auth/firebase'
import { useSelector } from 'react-redux'
import { async } from '@firebase/util'
import { useNavigate } from 'react-router-dom'

function Rent() {
    const [showMap, setShowMap] = useState(false)
    const [file, setfile] = useState('');
    const [location, setLocation] = useState('Abbottabad')
    const [type, setType] = useState('House')
    const [fileURL, setfileURL] = useState([]);
    const [latitute, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [marla, setMarla] = useState(null)
    const [price, setPrice] = useState(null)
    const [bedroom, setBedroom] = useState(null)
    const [bathroom, setBathroom] = useState(null)
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [email, setEmail] = useState(null)
    const [number, setNumber] = useState(null)
    const user = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate()

    useEffect(() => {
        // const getUsers2 = async () => {
        //     const docRef = doc(db, "users", user.id);
        //     const colRef = collection(docRef, "sell")
        //     const abc = doc(colRef, "arCLkL3QFhSROI5tj11O")
        //     let data = {
        //         city: location,
        //         type,
        //         location: new GeoPoint(latitute, longitude),
        //         area: marla,
        //         price,
        //         bedroom,
        //         bathroom,
        //         title,
        //         description,
        //         images: fileURL,
        //         email,
        //         number,
        //     }
        //     const state = await updateDoc(abc, data)
        //     console.log(state);
        // }

        // getUsers2()

        const getUsers = async () => {
            const docRef = doc(db, "users", user.id);
            const colRef = collection(docRef, "rent")
            const data = await getDocs(colRef)
            console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }

        getUsers()

    }, [])

    const handleChange = (event) => {
        setLocation(event.target.value);
        console.log(event.target.value);
    };

    const setLocations = (lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
    };


    const fileHandler = async (e) => {
        setfile(e.target.files[0]);

        if (file == null)
            return;

        toast(0, { autoClose: false, toastId: 1 })

        try {
            console.log("uploading")
            const storageRef = ref(Storage, `/propertyImages/${e.target.files[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
            console.log("uploaded");
            uploadTask.on('state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast.update(1, {
                        // position: toast.POSITION.TOP_CENTER,
                        render: 'Uploading ' + p.toFixed(0) + '%',
                    });
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {

                        let data = {
                            url: url
                        }
                        setfileURL((prev) => [...prev, data]);
                        toast.update(1, {
                            type: toast.TYPE.SUCCESS,
                            render: 'File uploaded',
                            autoClose: 1000
                        });
                    });
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    const handleType = (e) => {
        setType(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!latitute) {
            toast.error('Please select location', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        else {
            let data = {
                city: location,
                type,
                location: new GeoPoint(latitute, longitude),
                area: marla,
                price,
                bedroom,
                bathroom,
                title,
                description,
                images: fileURL,
                email,
                number,
            }
            console.log(data);
            // addDoc(collection(db, "users"), { id: res.user.uid, name: values.username, email: values.email, imgURL: "", role: 'user', phoneNo: "" })
            const docRef = doc(db, "users", user.id);
            const colRef = collection(docRef, "rent")
            addDoc(colRef, data).then((doc) => {
                toast.success('Ad posted Successfully', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                navigate('/UserDashboard')
            })
                .catch((e) => {
                    console.log(e);
                })
        }
    }

    const handleManage = () => {
        navigate('/ManageRent')

    }

    return (
        <div className={styles.Main}>
            <UserNavbar />
            <h1>Rent</h1>
            <form className={styles.Main2} onSubmit={handleSubmit}>
                <div className={styles.footer2}>
                    <Button variant='contained' onClick={handleManage}>Manage</Button>
                </div>
                <div className={styles.image}>
                    <img className={styles.s} src={image} />
                </div>
                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M37.871 18.501a1.885 1.885 0 11-.003-3.77 1.885 1.885 0 01.003 3.77zm0-2.5a.623.623 0 10-.077 1.244.623.623 0 00.077-1.244z" fill="#BDBDBD"></path><path d="M36.112 23.363l-3.55-3.388v-6.787h-3.75v3.213l-4.687-4.463-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h3.125v8.75a1.876 1.876 0 001.875 1.875h13.75a1.25 1.25 0 001.25-1.25v-9.375h3.125a.618.618 0 00.625-.625.606.606 0 00-.2-.45z" fill="#F3F3F1"></path><path d="M32.875 40.065a7.188 7.188 0 100-14.376 7.188 7.188 0 000 14.376z" fill="#E7F3EF"></path><path d="M31.625 16.401v-3.213h-2.813v.535l2.813 2.678zM14.75 23.813a.604.604 0 01.2-.45l10.582-10.085-1.407-1.34-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h2.813a.618.618 0 01-.625-.625zm3.75 9.375v-8.75h-2.813v8.75a1.876 1.876 0 001.875 1.875h2.813a1.876 1.876 0 01-1.875-1.875z" fill="#E8E8E8"></path><path d="M32.875 41.002A8.125 8.125 0 1141 32.877a8.134 8.134 0 01-8.125 8.125zm0-14.375a6.25 6.25 0 100 12.503 6.25 6.25 0 000-12.504v.001z" fill="#7ED8AA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M33.823 29.432h-1.85v2.503h-2.469v1.878h2.469v2.503h1.85v-2.503h2.473v-1.878h-2.473v-2.503z" fill="#00A651"></path><path d="M21.313 36.001h-3.75a2.815 2.815 0 01-2.813-2.812v-7.813h-2.187A1.565 1.565 0 0111 23.814a1.544 1.544 0 01.511-1.148L23.478 11.26a.94.94 0 011.294 0l3.1 2.954v-1.026a.938.938 0 01.938-.938h3.75a.938.938 0 01.938.938v6.388l1.148 1.1-1.3 1.355-1.438-1.375a.938.938 0 01-.289-.678v-5.852H29.75v2.275a.938.938 0 01-1.584.679l-4.041-3.847-10.772 10.268h2.335a.938.938 0 01.938.938v8.75a.938.938 0 00.938.938h3.75l-.001 1.874zm-8.519-11.967l-.009.009a.064.064 0 00.009-.009z" fill="#D6D6D6"></path></svg>
                        <p className={styles.p}>Location and Purpose</p>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <h4 className={styles.h4}>Select Property Type</h4>
                            <FormControl sx={{ minWidth: 220 }}>
                                <InputLabel htmlFor="grouped-select">Property</InputLabel>

                                <Select value={type} id="grouped-select" onChange={handleType} label="Grouping"  >
                                    <ListSubheader>---------------Home-------------</ListSubheader>
                                    <MenuItem value='House'>House</MenuItem>
                                    <MenuItem value='Flat'>Flat</MenuItem>
                                    <MenuItem value='Upper Portion'>Upper Portion</MenuItem>
                                    <MenuItem value='Lower Portion'>Lower Portion</MenuItem>
                                    <MenuItem value='Farm House'>Farm House</MenuItem>
                                    <MenuItem value='Room'>Room</MenuItem>
                                    <MenuItem value='Penthouse'>Penthouse</MenuItem>
                                    <ListSubheader>---------------Plots---------------</ListSubheader>
                                    <MenuItem value='Residential Plot'>Residential Plot</MenuItem>
                                    <MenuItem value='Commercial Plot'>Commercial Plot</MenuItem>
                                    <MenuItem value='Agricultural Land'>Agricultural Land</MenuItem>
                                    <MenuItem value='Industrial Land'>Industrial Land</MenuItem>
                                    <MenuItem value='Plot File'>Plot File</MenuItem>
                                    <MenuItem value='Plot Form'>Plot Form</MenuItem>
                                    <ListSubheader>-----------Commercial----------</ListSubheader>
                                    <MenuItem value='Office'>Office</MenuItem>
                                    <MenuItem value='Shop'>Shop</MenuItem>
                                    <MenuItem value='Warehouse'>Warehouse</MenuItem>
                                    <MenuItem value='Factory'>Factory</MenuItem>
                                    <MenuItem value='Building'>Building</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <h4 className={styles.h4}>City</h4>
                            <Box sx={{ minWidth: 220 }}>
                                <FormControl sx={{ minWidth: 220 }}>
                                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={location}
                                        label="Age"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Abbottabad">Abbottabad</MenuItem>
                                        <MenuItem value="Adezai">Adezai</MenuItem>
                                        <MenuItem value="Ali Bandar">Ali Bandar</MenuItem>
                                        <MenuItem value="Amir Chah">Amir Chah</MenuItem>
                                        <MenuItem value="Attock">Attock</MenuItem>
                                        <MenuItem value="Ayubia">Ayubia</MenuItem>
                                        <MenuItem value="Bahawalpur">Bahawalpur</MenuItem>
                                        <MenuItem value="Baden">Baden</MenuItem>
                                        <MenuItem value="Bagh">Bagh</MenuItem>
                                        <MenuItem value="Bahawalnagar">Bahawalnagar</MenuItem>
                                        <MenuItem value="Burewala">Burewala</MenuItem>
                                        <MenuItem value="Banda Daud Shah">Banda Daud Shah</MenuItem>
                                        <MenuItem value="Bannu district|Bannu">Bannu</MenuItem>
                                        <MenuItem value="Batagram">Batagram</MenuItem>
                                        <MenuItem value="Bazdar">Bazdar</MenuItem>
                                        <MenuItem value="Bela">Bela</MenuItem>
                                        <MenuItem value="Bellpat">Bellpat</MenuItem>
                                        <MenuItem value="Bhag">Bhag</MenuItem>
                                        <MenuItem value="Bhakkar">Bhakkar</MenuItem>
                                        <MenuItem value="Bhalwal">Bhalwal</MenuItem>
                                        <MenuItem value="Bhimber">Bhimber</MenuItem>
                                        <MenuItem value="Birote">Birote</MenuItem>
                                        <MenuItem value="Buner">Buner</MenuItem>
                                        <MenuItem value="Burj">Burj</MenuItem>
                                        <MenuItem value="Chiniot">Chiniot</MenuItem>
                                        <MenuItem value="Chachro">Chachro</MenuItem>
                                        <MenuItem value="Chagai">Chagai</MenuItem>
                                        <MenuItem value="Chah Sandan">Chah Sandan</MenuItem>
                                        <MenuItem value="Chailianwala">Chailianwala</MenuItem>
                                        <MenuItem value="Chakdara">Chakdara</MenuItem>
                                        <MenuItem value="Chakku">Chakku</MenuItem>
                                        <MenuItem value="Chakwal">Chakwal</MenuItem>
                                        <MenuItem value="Chaman">Chaman</MenuItem>
                                        <MenuItem value="Charsadda">Charsadda</MenuItem>
                                        <MenuItem value="Chhatr">Chhatr</MenuItem>
                                        <MenuItem value="Chichawatni">Chichawatni</MenuItem>
                                        <MenuItem value="Chitral">Chitral</MenuItem>
                                        <MenuItem value="Dadu">Dadu</MenuItem>
                                        <MenuItem value="Dera Ghazi Khan">Dera Ghazi Khan</MenuItem>
                                        <MenuItem value="Dera Ismail Khan">Dera Ismail Khan</MenuItem>
                                        <MenuItem value="Dalbandin">Dalbandin</MenuItem>
                                        <MenuItem value="Dargai">Dargai</MenuItem>
                                        <MenuItem value="Darya Khan">Darya Khan</MenuItem>
                                        <MenuItem value="Daska">Daska</MenuItem>
                                        <MenuItem value="Dera Bugti">Dera Bugti</MenuItem>
                                        <MenuItem value="Dhana Sar">Dhana Sar</MenuItem>
                                        <MenuItem value="Digri">Digri</MenuItem>
                                        <MenuItem value="Dina City|Dina">Dina</MenuItem>
                                        <MenuItem value="Dinga">Dinga</MenuItem>
                                        <MenuItem value="Diplo, Pakistan|Diplo">Diplo</MenuItem>
                                        <MenuItem value="Diwana">Diwana</MenuItem>
                                        <MenuItem value="Dokri">Dokri</MenuItem>
                                        <MenuItem value="Drosh">Drosh</MenuItem>
                                        <MenuItem value="Duki">Duki</MenuItem>
                                        <MenuItem value="Dushi">Dushi</MenuItem>
                                        <MenuItem value="Duzab">Duzab</MenuItem>
                                        <MenuItem value="Faisalabad">Faisalabad</MenuItem>
                                        <MenuItem value="Fateh Jang">Fateh Jang</MenuItem>
                                        <MenuItem value="Ghotki">Ghotki</MenuItem>
                                        <MenuItem value="Gwadar">Gwadar</MenuItem>
                                        <MenuItem value="Gujranwala">Gujranwala</MenuItem>
                                        <MenuItem value="Gujrat">Gujrat</MenuItem>
                                        <MenuItem value="Gadra">Gadra</MenuItem>
                                        <MenuItem value="Gajar">Gajar</MenuItem>
                                        <MenuItem value="Gandava">Gandava</MenuItem>
                                        <MenuItem value="Garhi Khairo">Garhi Khairo</MenuItem>
                                        <MenuItem value="Garruck">Garruck</MenuItem>
                                        <MenuItem value="Ghakhar Mandi">Ghakhar Mandi</MenuItem>
                                        <MenuItem value="Ghanian">Ghanian</MenuItem>
                                        <MenuItem value="Ghauspur">Ghauspur</MenuItem>
                                        <MenuItem value="Ghazluna">Ghazluna</MenuItem>
                                        <MenuItem value="Girdan">Girdan</MenuItem>
                                        <MenuItem value="Gulistan">Gulistan</MenuItem>
                                        <MenuItem value="Gwash">Gwash</MenuItem>
                                        <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                                        <MenuItem value="Hala">Hala</MenuItem>
                                        <MenuItem value="Haripur">Haripur</MenuItem>
                                        <MenuItem value="Hab Chauki">Hab Chauki</MenuItem>
                                        <MenuItem value="Hafizabad">Hafizabad</MenuItem>
                                        <MenuItem value="Hameedabad">Hameedabad</MenuItem>
                                        <MenuItem value="Hangu">Hangu</MenuItem>
                                        <MenuItem value="Harnai">Harnai</MenuItem>
                                        <MenuItem value="Hasilpur">Hasilpur</MenuItem>
                                        <MenuItem value="Haveli Lakha">Haveli Lakha</MenuItem>
                                        <MenuItem value="Hinglaj">Hinglaj</MenuItem>
                                        <MenuItem value="Hoshab">Hoshab</MenuItem>
                                        <MenuItem value="Islamabad">Islamabad</MenuItem>
                                        <MenuItem value="Islamkot">Islamkot</MenuItem>
                                        <MenuItem value="Ispikan">Ispikan</MenuItem>
                                        <MenuItem value="Jacobabad">Jacobabad</MenuItem>
                                        <MenuItem value="Jamshoro">Jamshoro</MenuItem>
                                        <MenuItem value="Jhang">Jhang</MenuItem>
                                        <MenuItem value="Jhelum">Jhelum</MenuItem>
                                        <MenuItem value="Jamesabad">Jamesabad</MenuItem>
                                        <MenuItem value="Jampur">Jampur</MenuItem>
                                        <MenuItem value="Janghar">Janghar</MenuItem>
                                        <MenuItem value="Jati, Jati(Mughalbhin)">Jati</MenuItem>
                                        <MenuItem value="Jauharabad">Jauharabad</MenuItem>
                                        <MenuItem value="Jhal">Jhal</MenuItem>
                                        <MenuItem value="Jhal Jhao">Jhal Jhao</MenuItem>
                                        <MenuItem value="Jhatpat">Jhatpat</MenuItem>
                                        <MenuItem value="Jhudo">Jhudo</MenuItem>
                                        <MenuItem value="Jiwani">Jiwani</MenuItem>
                                        <MenuItem value="Jungshahi">Jungshahi</MenuItem>
                                        <MenuItem value="Karachi">Karachi</MenuItem>
                                        <MenuItem value="Kotri">Kotri</MenuItem>
                                        <MenuItem value="Kalam">Kalam</MenuItem>
                                        <MenuItem value="Kalandi">Kalandi</MenuItem>
                                        <MenuItem value="Kalat">Kalat</MenuItem>
                                        <MenuItem value="Kamalia">Kamalia</MenuItem>
                                        <MenuItem value="Kamararod">Kamararod</MenuItem>
                                        <MenuItem value="Kamber">Kamber</MenuItem>
                                        <MenuItem value="Kamokey">Kamokey</MenuItem>
                                        <MenuItem value="Kanak">Kanak</MenuItem>
                                        <MenuItem value="Kandi">Kandi</MenuItem>
                                        <MenuItem value="Kandiaro">Kandiaro</MenuItem>
                                        <MenuItem value="Kanpur">Kanpur</MenuItem>
                                        <MenuItem value="Kapip">Kapip</MenuItem>
                                        <MenuItem value="Kappar">Kappar</MenuItem>
                                        <MenuItem value="Karak City">Karak City</MenuItem>
                                        <MenuItem value="Karodi">Karodi</MenuItem>
                                        <MenuItem value="Kashmor">Kashmor</MenuItem>
                                        <MenuItem value="Kasur">Kasur</MenuItem>
                                        <MenuItem value="Katuri">Katuri</MenuItem>
                                        <MenuItem value="Keti Bandar">Keti Bandar</MenuItem>
                                        <MenuItem value="Khairpur">Khairpur</MenuItem>
                                        <MenuItem value="Khanaspur">Khanaspur</MenuItem>
                                        <MenuItem value="Khanewal">Khanewal</MenuItem>
                                        <MenuItem value="Kharan">Kharan</MenuItem>
                                        <MenuItem value="kharian">kharian</MenuItem>
                                        <MenuItem value="Khokhropur">Khokhropur</MenuItem>
                                        <MenuItem value="Khora">Khora</MenuItem>
                                        <MenuItem value="Khushab">Khushab</MenuItem>
                                        <MenuItem value="Khuzdar">Khuzdar</MenuItem>
                                        <MenuItem value="Kikki">Kikki</MenuItem>
                                        <MenuItem value="Klupro">Klupro</MenuItem>
                                        <MenuItem value="Kohan">Kohan</MenuItem>
                                        <MenuItem value="Kohat">Kohat</MenuItem>
                                        <MenuItem value="Kohistan">Kohistan</MenuItem>
                                        <MenuItem value="Kohlu">Kohlu</MenuItem>
                                        <MenuItem value="Korak">Korak</MenuItem>
                                        <MenuItem value="Korangi">Korangi</MenuItem>
                                        <MenuItem value="Kot Sarae">Kot Sarae</MenuItem>
                                        <MenuItem value="Kotli">Kotli</MenuItem>
                                        <MenuItem value="Lahore">Lahore</MenuItem>
                                        <MenuItem value="Larkana">Larkana</MenuItem>
                                        <MenuItem value="Lahri">Lahri</MenuItem>
                                        <MenuItem value="Lakki Marwat">Lakki Marwat</MenuItem>
                                        <MenuItem value="Lasbela">Lasbela</MenuItem>
                                        <MenuItem value="Latamber">Latamber</MenuItem>
                                        <MenuItem value="Layyah">Layyah</MenuItem>
                                        <MenuItem value="Leiah">Leiah</MenuItem>
                                        <MenuItem value="Liari">Liari</MenuItem>
                                        <MenuItem value="Lodhran">Lodhran</MenuItem>
                                        <MenuItem value="Loralai">Loralai</MenuItem>
                                        <MenuItem value="Lower Dir">Lower Dir</MenuItem>
                                        <MenuItem value="Shadan Lund">Shadan Lund</MenuItem>
                                        <MenuItem value="Multan">Multan</MenuItem>
                                        <MenuItem value="Mandi Bahauddin">Mandi Bahauddin</MenuItem>
                                        <MenuItem value="Mansehra">Mansehra</MenuItem>
                                        <MenuItem value="Mian Chanu">Mian Chanu</MenuItem>
                                        <MenuItem value="Mirpur">Mirpur</MenuItem>
                                        <MenuItem value="Moro, Pakistan|Moro">Moro</MenuItem>
                                        <MenuItem value="Mardan">Mardan</MenuItem>
                                        <MenuItem value="Mach">Mach</MenuItem>
                                        <MenuItem value="Madyan">Madyan</MenuItem>
                                        <MenuItem value="Malakand">Malakand</MenuItem>
                                        <MenuItem value="Mand">Mand</MenuItem>
                                        <MenuItem value="Manguchar">Manguchar</MenuItem>
                                        <MenuItem value="Mashki Chah">Mashki Chah</MenuItem>
                                        <MenuItem value="Maslti">Maslti</MenuItem>
                                        <MenuItem value="Mastuj">Mastuj</MenuItem>
                                        <MenuItem value="Mastung">Mastung</MenuItem>
                                        <MenuItem value="Mathi">Mathi</MenuItem>
                                        <MenuItem value="Matiari">Matiari</MenuItem>
                                        <MenuItem value="Mehar">Mehar</MenuItem>
                                        <MenuItem value="Mekhtar">Mekhtar</MenuItem>
                                        <MenuItem value="Merui">Merui</MenuItem>
                                        <MenuItem value="Mianwali">Mianwali</MenuItem>
                                        <MenuItem value="Mianez">Mianez</MenuItem>
                                        <MenuItem value="Mirpur Batoro">Mirpur Batoro</MenuItem>
                                        <MenuItem value="Mirpur Khas">Mirpur Khas</MenuItem>
                                        <MenuItem value="Mirpur Sakro">Mirpur Sakro</MenuItem>
                                        <MenuItem value="Mithi">Mithi</MenuItem>
                                        <MenuItem value="Mongora">Mongora</MenuItem>
                                        <MenuItem value="Murgha Kibzai">Murgha Kibzai</MenuItem>
                                        <MenuItem value="Muridke">Muridke</MenuItem>
                                        <MenuItem value="Musa Khel Bazar">Musa Khel Bazar</MenuItem>
                                        <MenuItem value="Muzaffar Garh">Muzaffar Garh</MenuItem>
                                        <MenuItem value="Muzaffarabad">Muzaffarabad</MenuItem>
                                        <MenuItem value="Nawabshah">Nawabshah</MenuItem>
                                        <MenuItem value="Nazimabad">Nazimabad</MenuItem>
                                        <MenuItem value="Nowshera">Nowshera</MenuItem>
                                        <MenuItem value="Nagar Parkar">Nagar Parkar</MenuItem>
                                        <MenuItem value="Nagha Kalat">Nagha Kalat</MenuItem>
                                        <MenuItem value="Nal">Nal</MenuItem>
                                        <MenuItem value="Naokot">Naokot</MenuItem>
                                        <MenuItem value="Nasirabad">Nasirabad</MenuItem>
                                        <MenuItem value="Nauroz Kalat">Nauroz Kalat</MenuItem>
                                        <MenuItem value="Naushara">Naushara</MenuItem>
                                        <MenuItem value="Nur Gamma">Nur Gamma</MenuItem>
                                        <MenuItem value="Nushki">Nushki</MenuItem>
                                        <MenuItem value="Nuttal">Nuttal</MenuItem>
                                        <MenuItem value="Okara">Okara</MenuItem>
                                        <MenuItem value="Ormara">Ormara</MenuItem>
                                        <MenuItem value="Peshawar">Peshawar</MenuItem>
                                        <MenuItem value="Panjgur">Panjgur</MenuItem>
                                        <MenuItem value="Pasni City">Pasni City</MenuItem>
                                        <MenuItem value="Paharpur">Paharpur</MenuItem>
                                        <MenuItem value="Palantuk">Palantuk</MenuItem>
                                        <MenuItem value="Pendoo">Pendoo</MenuItem>
                                        <MenuItem value="Piharak">Piharak</MenuItem>
                                        <MenuItem value="Pirmahal">Pirmahal</MenuItem>
                                        <MenuItem value="Pishin">Pishin</MenuItem>
                                        <MenuItem value="Plandri">Plandri</MenuItem>
                                        <MenuItem value="Pokran">Pokran</MenuItem>
                                        <MenuItem value="Pounch">Pounch</MenuItem>
                                        <MenuItem value="Quetta">Quetta</MenuItem>
                                        <MenuItem value="Qambar">Qambar</MenuItem>
                                        <MenuItem value="Qamruddin Karez">Qamruddin Karez</MenuItem>
                                        <MenuItem value="Qazi Ahmad">Qazi Ahmad</MenuItem>
                                        <MenuItem value="Qila Abdullah">Qila Abdullah</MenuItem>
                                        <MenuItem value="Qila Ladgasht">Qila Ladgasht</MenuItem>
                                        <MenuItem value="Qila Safed">Qila Safed</MenuItem>
                                        <MenuItem value="Qila Saifullah">Qila Saifullah</MenuItem>
                                        <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
                                        <MenuItem value="Rabwah">Rabwah</MenuItem>
                                        <MenuItem value="Rahim Yar Khan">Rahim Yar Khan</MenuItem>
                                        <MenuItem value="Rajan Pur">Rajan Pur</MenuItem>
                                        <MenuItem value="Rakhni">Rakhni</MenuItem>
                                        <MenuItem value="Ranipur">Ranipur</MenuItem>
                                        <MenuItem value="Ratodero">Ratodero</MenuItem>
                                        <MenuItem value="Rawalakot">Rawalakot</MenuItem>
                                        <MenuItem value="Renala Khurd">Renala Khurd</MenuItem>
                                        <MenuItem value="Robat Thana">Robat Thana</MenuItem>
                                        <MenuItem value="Rodkhan">Rodkhan</MenuItem>
                                        <MenuItem value="Rohri">Rohri</MenuItem>
                                        <MenuItem value="Sialkot">Sialkot</MenuItem>
                                        <MenuItem value="Sadiqabad">Sadiqabad</MenuItem>
                                        <MenuItem value="Safdar Abad- (Dhaban Singh)">Safdar Abad</MenuItem>
                                        <MenuItem value="Sahiwal">Sahiwal</MenuItem>
                                        <MenuItem value="Saidu Sharif">Saidu Sharif</MenuItem>
                                        <MenuItem value="Saindak">Saindak</MenuItem>
                                        <MenuItem value="Sakrand">Sakrand</MenuItem>
                                        <MenuItem value="Sanjawi">Sanjawi</MenuItem>
                                        <MenuItem value="Sargodha">Sargodha</MenuItem>
                                        <MenuItem value="Saruna">Saruna</MenuItem>
                                        <MenuItem value="Shabaz Kalat">Shabaz Kalat</MenuItem>
                                        <MenuItem value="Shadadkhot">Shadadkhot</MenuItem>
                                        <MenuItem value="Shahbandar">Shahbandar</MenuItem>
                                        <MenuItem value="Shahpur">Shahpur</MenuItem>
                                        <MenuItem value="Shahpur Chakar">Shahpur Chakar</MenuItem>
                                        <MenuItem value="Shakargarh">Shakargarh</MenuItem>
                                        <MenuItem value="Shangla">Shangla</MenuItem>
                                        <MenuItem value="Sharam Jogizai">Sharam Jogizai</MenuItem>
                                        <MenuItem value="Sheikhupura">Sheikhupura</MenuItem>
                                        <MenuItem value="Shikarpur">Shikarpur</MenuItem>
                                        <MenuItem value="Shingar">Shingar</MenuItem>
                                        <MenuItem value="Shorap">Shorap</MenuItem>
                                        <MenuItem value="Sibi">Sibi</MenuItem>
                                        <MenuItem value="Sohawa">Sohawa</MenuItem>
                                        <MenuItem value="Sonmiani">Sonmiani</MenuItem>
                                        <MenuItem value="Sooianwala">Sooianwala</MenuItem>
                                        <MenuItem value="Spezand">Spezand</MenuItem>
                                        <MenuItem value="Spintangi">Spintangi</MenuItem>
                                        <MenuItem value="Sui">Sui</MenuItem>
                                        <MenuItem value="Sujawal">Sujawal</MenuItem>
                                        <MenuItem value="Sukkur">Sukkur</MenuItem>
                                        <MenuItem value="Suntsar">Suntsar</MenuItem>
                                        <MenuItem value="Surab">Surab</MenuItem>
                                        <MenuItem value="Swabi">Swabi</MenuItem>
                                        <MenuItem value="Swat">Swat</MenuItem>
                                        <MenuItem value="Tando Adam">Tando Adam</MenuItem>
                                        <MenuItem value="Tando Bago">Tando Bago</MenuItem>
                                        <MenuItem value="Tangi">Tangi</MenuItem>
                                        <MenuItem value="Tank City">Tank City</MenuItem>
                                        <MenuItem value="Tar Ahamd Rind">Tar Ahamd Rind</MenuItem>
                                        <MenuItem value="Thalo">Thalo</MenuItem>
                                        <MenuItem value="Thatta">Thatta</MenuItem>
                                        <MenuItem value="Toba Tek Singh">Toba Tek Singh</MenuItem>
                                        <MenuItem value="Tordher">Tordher</MenuItem>
                                        <MenuItem value="Tujal">Tujal</MenuItem>
                                        <MenuItem value="Tump">Tump</MenuItem>
                                        <MenuItem value="Turbat">Turbat</MenuItem>
                                        <MenuItem value="Umarao">Umarao</MenuItem>
                                        <MenuItem value="Umarkot">Umarkot</MenuItem>
                                        <MenuItem value="Upper Dir">Upper Dir</MenuItem>
                                        <MenuItem value="Uthal">Uthal</MenuItem>
                                        <MenuItem value="Vehari">Vehari</MenuItem>
                                        <MenuItem value="Veirwaro">Veirwaro</MenuItem>
                                        <MenuItem value="Vitakri">Vitakri</MenuItem>
                                        <MenuItem value="Wadh">Wadh</MenuItem>
                                        <MenuItem value="Wah Cantt">Wah Cantt</MenuItem>
                                        <MenuItem value="Warah">Warah</MenuItem>
                                        <MenuItem value="Washap">Washap</MenuItem>
                                        <MenuItem value="Wasjuk">Wasjuk</MenuItem>
                                        <MenuItem value="Wazirabad">Wazirabad</MenuItem>
                                        <MenuItem value="Yakmach">Yakmach</MenuItem>
                                        <MenuItem value="Zhob">Zhob</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div>
                            <h4 className={styles.h4}>Location</h4>
                            {/* <div className={styles.Map}> */}
                            <Button variant="contained" onClick={() => { setShowMap(true) }}>{latitute !== null ? 'Change Location' : 'Select Location'}</Button>
                            {showMap && <GoogleMaps2 closeUpload={setShowMap} locations={setLocations} />}
                            {latitute !== null && <div className={styles.Map}>
                                <GoogleMaps lat={latitute} lng={longitude} />
                            </div>}

                        </div>
                    </div>
                </div>

                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M12.8 16.4a1.807 1.807 0 11.005-3.615 1.807 1.807 0 01-.005 3.614zm0-2.4a.6.6 0 10-.074 1.198.6.6 0 00.074-1.199z" fill="#A4AFC1"></path><path d="M38.973 25.916A3.591 3.591 0 0040.1 23.3v-8.4a2.4 2.4 0 00-2.4-2.4h-8.4a3.6 3.6 0 00-2.616 1.126L13.756 27.05a2.4 2.4 0 00.047 3.346l8.4 8.4a2.4 2.4 0 003.346.047l13.424-12.927z" fill="#F3F3F1"></path><path d="M35 19.1a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#2FDF84"></path><path d="M33.2 39.5a6.9 6.9 0 100-13.8 6.9 6.9 0 000 13.8z" fill="#E7F3EF"></path><path d="M24.903 38.797l-8.855-8.855c-.442-.442-.821-.585-.83-1.21-.009-.624.282-.732 1.238-1.681l12.928-13.425A3.588 3.588 0 0132 12.5h-2.7a3.6 3.6 0 00-2.616 1.126L13.756 27.05a2.4 2.4 0 00.047 3.346l8.4 8.4a2.388 2.388 0 003.043.284 2.429 2.429 0 01-.343-.283z" fill="#E6E6E6"></path><path d="M36.2 17.6c.002-.22.054-.435.15-.631a1.5 1.5 0 100 1.262 1.468 1.468 0 01-.15-.631z" fill="#00B871"></path><path d="M33.2 40.4a7.8 7.8 0 117.8-7.8 7.809 7.809 0 01-7.8 7.8zm0-13.8a6 6 0 106 6 6.007 6.007 0 00-6-6z" fill="#7ED8AA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M34.1 29.3h-1.8v2.4h-2.4v1.8h2.4v2.4h1.8v-2.4h2.4v-1.8h-2.4v-2.4z" fill="#00A651"></path><path d="M23.9 40.4a3.238 3.238 0 01-2.338-.98l-8.39-8.392A3.225 3.225 0 0112.2 28.7c.001-.847.328-1.66.913-2.272L26.035 13a4.465 4.465 0 013.265-1.4h8.4a3.3 3.3 0 013.3 3.3v8.4c.004.39-.048.778-.156 1.153l-1.727-.506a2.28 2.28 0 00.083-.647v-8.4a1.5 1.5 0 00-1.5-1.5h-8.4a2.682 2.682 0 00-1.963.848L14.408 27.68A1.47 1.47 0 0014 28.7a1.447 1.447 0 00.436 1.048l8.408 8.408a1.49 1.49 0 001.58.343l.68 1.667a3.205 3.205 0 01-1.2.234H23.9z" fill="#BDBDBD"></path><path d="M35 20a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0-3a.6.6 0 100 1.199.6.6 0 000-1.2z" fill="#BDBDBD"></path></svg>
                        <p className={styles.p}>Price and Area</p>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <h4 className={styles.h4}>Area Size</h4>
                            <FormControl sx={{ width: '25ch' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    endAdornment={<InputAdornment position="end">Marla</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    required
                                    type='number'
                                    value={marla} onChange={(e) => setMarla(parseInt(e.target.value))}
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div>
                            <h4 className={styles.h4}>Price</h4>
                            <FormControl variant="standard">
                                <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                                <Input
                                    id="standard-adornment-amount"
                                    startAdornment={<InputAdornment position="start">PKR</InputAdornment>}
                                    required
                                    value={price} onChange={(e) => setPrice(parseInt(e.target.value))}
                                    type='number'
                                />
                            </FormControl>
                        </div>
                    </div>

                </div>
                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M37.871 18.501a1.885 1.885 0 11-.003-3.77 1.885 1.885 0 01.003 3.77zm0-2.5a.623.623 0 10-.077 1.244.623.623 0 00.077-1.244z" fill="#BDBDBD"></path><path d="M36.112 23.363l-3.55-3.388v-6.787h-3.75v3.213l-4.687-4.463-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h3.125v8.75a1.876 1.876 0 001.875 1.875h13.75a1.25 1.25 0 001.25-1.25v-9.375h3.125a.618.618 0 00.625-.625.606.606 0 00-.2-.45z" fill="#F3F3F1"></path><path d="M32.875 40.065a7.188 7.188 0 100-14.376 7.188 7.188 0 000 14.376z" fill="#E7F3EF"></path><path d="M31.625 16.401v-3.213h-2.813v.535l2.813 2.678zM14.75 23.813a.604.604 0 01.2-.45l10.582-10.085-1.407-1.34-11.988 11.425a.605.605 0 00-.2.45.618.618 0 00.625.625h2.813a.618.618 0 01-.625-.625zm3.75 9.375v-8.75h-2.813v8.75a1.876 1.876 0 001.875 1.875h2.813a1.876 1.876 0 01-1.875-1.875z" fill="#E8E8E8"></path><path d="M32.875 41.002A8.125 8.125 0 1141 32.877a8.134 8.134 0 01-8.125 8.125zm0-14.375a6.25 6.25 0 100 12.503 6.25 6.25 0 000-12.504v.001z" fill="#7ED8AA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M33.876 29.938a.938.938 0 11-1.876 0 .938.938 0 011.876 0zm-.001 2.499H32v4.375h1.875v-4.375z" fill="#00A651"></path><path d="M21.313 36.001h-3.75a2.815 2.815 0 01-2.813-2.812v-7.813h-2.187A1.565 1.565 0 0111 23.814a1.544 1.544 0 01.511-1.148L23.478 11.26a.94.94 0 011.294 0l3.1 2.954v-1.026a.938.938 0 01.938-.938h3.75a.938.938 0 01.938.938v6.388l1.148 1.1-1.3 1.355-1.438-1.375a.938.938 0 01-.289-.678v-5.852H29.75v2.275a.938.938 0 01-1.584.679l-4.041-3.847-10.772 10.268h2.335a.938.938 0 01.938.938v8.75a.938.938 0 00.938.938h3.75l-.001 1.874zm-8.519-11.967l-.009.009a.064.064 0 00.009-.009z" fill="#D6D6D6"></path></svg>
                        <p className={styles.p}>Feature and Amenities</p>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <h4 className={styles.h4}>Bedroom</h4>
                            <FormControl sx={{ width: '25ch' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    aria-describedby="outlined-weight-helper-text"
                                    type='number'
                                    required
                                    placeholder='e.g 4,5,6'
                                    value={bedroom} onChange={(e) => setBedroom(parseInt(e.target.value))}
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div>
                            <h4 className={styles.h4}>Bathroom</h4>
                            <FormControl sx={{ width: '25ch' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    aria-describedby="outlined-weight-helper-text"
                                    type='number'
                                    required
                                    placeholder='e.g 4,5,6'
                                    value={bathroom} onChange={(e) => setBathroom(parseInt(e.target.value))}
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>

                </div>
                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M29.053 19.677h-2.409v1.2a1.2 1.2 0 01-1.2 1.2h-6.628a1.2 1.2 0 01-1.2-1.2v-1.2h-2.413a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h13.85a2.416 2.416 0 002.409-2.409V22.086a2.416 2.416 0 00-2.409-2.409z" fill="#F3F3F1"></path><path d="M26.645 18.473v2.409a1.2 1.2 0 01-1.2 1.2h-6.629a1.2 1.2 0 01-1.2-1.2v-2.409h2.108a2.409 2.409 0 014.818 0h2.103z" fill="#A8E1C4"></path><path d="M32.968 43.162a6.925 6.925 0 100-13.85 6.925 6.925 0 000 13.85z" fill="#E7F3EF"></path><path d="M15.504 37.141V22.086a2.41 2.41 0 012.108-2.379v-.03h-2.409a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h2.71a2.416 2.416 0 01-2.409-2.409zm13.85-16.26v-1.174c-.1-.017-.2-.027-.3-.03h-2.41v1.2a1.2 1.2 0 01-1.2 1.2h2.71a1.2 1.2 0 001.2-1.196z" fill="#D5DBE1"></path><path d="M20.322 20.882v-2.409h2.108a2.41 2.41 0 011.054-1.987 2.389 2.389 0 00-3.056.286 2.416 2.416 0 00-.708 1.701h-2.108v2.409a1.2 1.2 0 001.2 1.2h2.71a1.2 1.2 0 01-1.2-1.2zm12.646 23.184a7.83 7.83 0 117.829-7.829 7.838 7.838 0 01-7.829 7.829zm0-13.851a6.022 6.022 0 106.022 6.022 6.029 6.029 0 00-6.022-6.021v-.001z" fill="#7ED8AA"></path><path d="M31.763 39.549a.902.902 0 01-.638-.265l-2.409-2.409 1.278-1.278 1.726 1.73 3.579-4.09 1.36 1.19-4.213 4.814a.906.906 0 01-.65.308h-.033z" fill="#00A651"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18.817 22.989h6.624a2.11 2.11 0 002.102-2.108v-.3h1.511a1.508 1.508 0 011.505 1.505v3.722h1.806v-3.722a3.316 3.316 0 00-3.312-3.312h-1.51v-.302a.9.9 0 00-.9-.9h-1.33a3.312 3.312 0 00-6.374 0h-1.33a.9.9 0 00-.9.9v.302h-1.506a3.317 3.317 0 00-3.312 3.312v15.055a3.316 3.316 0 003.312 3.312h7.756v-1.807h-7.756a1.508 1.508 0 01-1.505-1.505V22.086a1.508 1.508 0 011.505-1.505h1.506v.3a2.11 2.11 0 002.108 2.108zm-.301-2.108v-1.505l1.213-.001a.9.9 0 00.9-.9 1.506 1.506 0 013.011 0 .9.9 0 00.9.9h1.2v1.506a.3.3 0 01-.3.3h-6.624a.301.301 0 01-.3-.3z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.407 24.795h11.442v1.807H16.407v-1.807zm0 3.614h8.635v1.807h-8.635v-1.807zm6.55 3.613h-6.55v1.807h6.55v-1.807z" fill="#D0D0D0"></path><path d="M42.302 31.118a1.807 1.807 0 110-3.614 1.807 1.807 0 010 3.614zm0-2.409a.6.6 0 100 1.2.6.6 0 000-1.2z" fill="#A4AFC1"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.876 7.934h-1.2v2.409h1.2V7.934zm-5.415 3.914h2.409v1.2h-2.409v-1.2zm6.925 0h2.409v1.2h-2.409v-1.2z" fill="#A4AFC1"></path></svg>
                        <p className={styles.p}>Ad Information</p>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <h4 className={styles.h4}>Title</h4>
                            <FormControl sx={{ width: '70%' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    aria-describedby="outlined-weight-helper-text"
                                    required
                                    value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter property title e.g. Beautiful House in DHA Phase 5"
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div>
                            <h4 className={styles.h4}>Description</h4>
                            <textarea rows={20} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe your property, it’s features, area it is in etc." style={{ width: '80%', padding: '10px' }} />
                        </div>
                    </div>

                </div>
                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M29.053 19.677h-2.409v1.2a1.2 1.2 0 01-1.2 1.2h-6.628a1.2 1.2 0 01-1.2-1.2v-1.2h-2.413a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h13.85a2.416 2.416 0 002.409-2.409V22.086a2.416 2.416 0 00-2.409-2.409z" fill="#F3F3F1"></path><path d="M26.645 18.473v2.409a1.2 1.2 0 01-1.2 1.2h-6.629a1.2 1.2 0 01-1.2-1.2v-2.409h2.108a2.409 2.409 0 014.818 0h2.103z" fill="#A8E1C4"></path><path d="M32.968 43.162a6.925 6.925 0 100-13.85 6.925 6.925 0 000 13.85z" fill="#E7F3EF"></path><path d="M15.504 37.141V22.086a2.41 2.41 0 012.108-2.379v-.03h-2.409a2.416 2.416 0 00-2.409 2.409v15.055a2.417 2.417 0 002.409 2.409h2.71a2.416 2.416 0 01-2.409-2.409zm13.85-16.26v-1.174c-.1-.017-.2-.027-.3-.03h-2.41v1.2a1.2 1.2 0 01-1.2 1.2h2.71a1.2 1.2 0 001.2-1.196z" fill="#D5DBE1"></path><path d="M20.322 20.882v-2.409h2.108a2.41 2.41 0 011.054-1.987 2.389 2.389 0 00-3.056.286 2.416 2.416 0 00-.708 1.701h-2.108v2.409a1.2 1.2 0 001.2 1.2h2.71a1.2 1.2 0 01-1.2-1.2zm12.646 23.184a7.83 7.83 0 117.829-7.829 7.838 7.838 0 01-7.829 7.829zm0-13.851a6.022 6.022 0 106.022 6.022 6.029 6.029 0 00-6.022-6.021v-.001z" fill="#7ED8AA"></path><path d="M31.763 39.549a.902.902 0 01-.638-.265l-2.409-2.409 1.278-1.278 1.726 1.73 3.579-4.09 1.36 1.19-4.213 4.814a.906.906 0 01-.65.308h-.033z" fill="#00A651"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M18.817 22.989h6.624a2.11 2.11 0 002.102-2.108v-.3h1.511a1.508 1.508 0 011.505 1.505v3.722h1.806v-3.722a3.316 3.316 0 00-3.312-3.312h-1.51v-.302a.9.9 0 00-.9-.9h-1.33a3.312 3.312 0 00-6.374 0h-1.33a.9.9 0 00-.9.9v.302h-1.506a3.317 3.317 0 00-3.312 3.312v15.055a3.316 3.316 0 003.312 3.312h7.756v-1.807h-7.756a1.508 1.508 0 01-1.505-1.505V22.086a1.508 1.508 0 011.505-1.505h1.506v.3a2.11 2.11 0 002.108 2.108zm-.301-2.108v-1.505l1.213-.001a.9.9 0 00.9-.9 1.506 1.506 0 013.011 0 .9.9 0 00.9.9h1.2v1.506a.3.3 0 01-.3.3h-6.624a.301.301 0 01-.3-.3z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.407 24.795h11.442v1.807H16.407v-1.807zm0 3.614h8.635v1.807h-8.635v-1.807zm6.55 3.613h-6.55v1.807h6.55v-1.807z" fill="#D0D0D0"></path><path d="M42.302 31.118a1.807 1.807 0 110-3.614 1.807 1.807 0 010 3.614zm0-2.409a.6.6 0 100 1.2.6.6 0 000-1.2z" fill="#A4AFC1"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.876 7.934h-1.2v2.409h1.2V7.934zm-5.415 3.914h2.409v1.2h-2.409v-1.2zm6.925 0h2.409v1.2h-2.409v-1.2z" fill="#A4AFC1"></path></svg>
                        <p className={styles.p}>Property Images</p>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.images}>
                            <h4 className={styles.h4}>Upload Images of your Property</h4>

                            <input required yclassName={styles.input} type="file" onChange={fileHandler} accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip,.rar,.7zip" />
                            {fileURL.length > 0 && <div className={styles.holder}>
                                {fileURL.map((value) => {
                                    return (
                                        <img style={{ width: '80px' }} src={value.url} />
                                    )
                                })}
                            </div>}


                        </div>
                    </div>

                </div>
                <div className={styles.location}>
                    <div className={styles.left}>
                        <svg width="52" height="52" viewBox="0 0 52 52"><path d="M42 0H10C4.477 0 0 4.477 0 10v32c0 5.523 4.477 10 10 10h32c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10z" fill="#FAFAFA"></path><path d="M33.717 35.854v4.52a1.433 1.433 0 01-1.571 1.406A21.228 21.228 0 0112.59 22.238a1.43 1.43 0 011.406-1.552l4.414-.032a1.417 1.417 0 011.38 1.067l.922 3.662a1.406 1.406 0 01-.522 1.471l-2.256 1.68a17.756 17.756 0 007.807 7.852l1.734-2.3a1.425 1.425 0 011.48-.522l3.689.916a1.413 1.413 0 011.073 1.374z" fill="#F3F3F1"></path><path d="M32.996 41.582a1.4 1.4 0 01-.845.2 21.25 21.25 0 01-19.562-19.55 1.422 1.422 0 011.4-1.541l4.424-.037a.484.484 0 01.186.025l-2.125.012a1.421 1.421 0 00-1.4 1.541 21.226 21.226 0 0017.922 19.35z" fill="#D5DBE1"></path><path d="M32.264 42.713c-.063 0-.127 0-.189-.007a22.263 22.263 0 01-20.41-20.4 2.4 2.4 0 01.625-1.8 2.306 2.306 0 011.7-.752l4.414-.031a2.35 2.35 0 012.288 1.772l.922 3.664a2.327 2.327 0 01-.872 2.445l-1.614 1.2a16.94 16.94 0 006.348 6.38l1.251-1.657a2.353 2.353 0 012.448-.865l3.689.916a2.34 2.34 0 011.783 2.273v4.521a2.3 2.3 0 01-.739 1.706 2.43 2.43 0 01-1.639.635h-.005zM18.413 21.586l-4.405.031a.457.457 0 00-.345.153.523.523 0 00-.135.4 20.387 20.387 0 0018.691 18.676.535.535 0 00.418-.139.45.45 0 00.148-.337v-4.52a.48.48 0 00-.368-.464l-3.689-.914a.485.485 0 00-.511.179l-1.735 2.3a.936.936 0 01-1.168.268 18.793 18.793 0 01-8.217-8.266.933.933 0 01.277-1.164l2.256-1.68a.473.473 0 00.179-.493l-.922-3.664a.486.486 0 00-.473-.362l-.001-.004zm14.372 1.864h1.864v5.592h-1.864V23.45z" fill="#D0D0D0"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M28.96 11.167l-.88-.88-1.757 1.758.879.879 1.757-1.757zm-5.053 5.053l-.879-.88-1.757 1.758.879.879 1.757-1.757zm-1.977-5.931l1.757 1.757-.879.879-1.757-1.757.879-.88z" fill="#A4AFC1"></path><path d="M33.717 29.553a7.707 7.707 0 100-15.414 7.707 7.707 0 000 15.414z" fill="#E7F3EF"></path><path d="M33.717 30.556a8.713 8.713 0 118.712-8.712 8.722 8.722 0 01-8.712 8.712zm0-15.413a6.7 6.7 0 106.7 6.7 6.71 6.71 0 00-6.7-6.7z" fill="#7ED8AA"></path><path d="M32.377 25.532a1 1 0 01-.71-.295l-2.681-2.68 1.422-1.422 1.921 1.921 3.987-4.552 1.513 1.324-4.691 5.361a1.01 1.01 0 01-.724.343h-.037z" fill="#00A651"></path></svg>
                        <p className={styles.p}>Contact Information</p>
                    </div>
                    <div className={styles.right}>
                        <div>
                            <h4 className={styles.h4}>Email</h4>
                            <FormControl sx={{ width: '30%' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    aria-describedby="outlined-weight-helper-text"
                                    required
                                    type="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email"
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div>
                            <h4 className={styles.h4}>Mobile</h4>
                            <FormControl sx={{ width: '30%' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    aria-describedby="outlined-weight-helper-text"
                                    placeholder="Enter Mobile Number"
                                    required
                                    type='number'
                                    value={number} onChange={(e) => setNumber(parseInt(e.target.value))}
                                    inputProps={{
                                        'aria-label': '',
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>

                </div>

                <div className={styles.footer}>  <Button variant='contained' type='submit' sx={{ margin: '15px' }}>Rent</Button></div>
            </form>
        </div>
    )
}

export default Rent