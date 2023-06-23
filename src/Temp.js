import { db } from './Utils/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function App() {
    const [users, setUsers] = useState([])
    const [name, setName] = useState()
    const [age, setAge] = useState()
    const userCollectionRef = collection(db, "users")

    const getUsers = async () => {
        const data = await getDocs(userCollectionRef)
        console.log(data.docs)
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getUsers()
    }, [])

    const handle = async (e) => {
        e.preventDefault();
        const alert = await addDoc(userCollectionRef, { name: name, age: age })
        if (alert) {
            getUsers()
        }
        alert('22')
    }

    const addAge = async (id, age) => {
        const doc2 = doc(db, "users", id)
        const data = { age: age + 1 }
        const state = await updateDoc(doc2, data)
        if (state) {
            getUsers();
        }
    }

    const deletes = async (id) => {
        const state = await deleteDoc(doc(db, "users", id));
        if (state) {
            alert('deleted')
        }
    }

    return (
        <div className="App">
            <form onSubmit={handle}>
                <input required type='text' value={name} onChange={(e) => setName(e.target.value)} />
                <input required type='number' value={age} onChange={(e) => setAge(e.target.value)} />
                <button type='submit'>Add</button>
            </form>

            {users?.map((value, index) => {
                return (
                    <>
                        <p>{value.name}</p>
                        <p>{value.age}</p>
                        <button onClick={() => addAge(value.id, value.age)}>Add</button>
                        <button onClick={() => deletes(value.id)}>Delete</button>
                    </>
                )
            })}

        </div>
    );
}