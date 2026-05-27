import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth'
import {auth, db} from './firebase'
import {doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, addDoc} from 'firebase/firestore'




export const loginEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const registerEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}


export const saveUserProfile = async (uid, profileData) => {
    const docRef = doc(db, 'users', uid)
    return await setDoc(docRef, profileData, { merge: true });
};

export const getUserProfile = async (uid) => {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    }
    return null
}

export const logoutUser = () => {
    return signOut(auth);
}


export const addToFavorites = async (uid, productId, productData) => {
    const docRef = doc(db, 'users', uid, 'favorites', productId);
    return await setDoc(docRef, {
        productId, name: productData.name, title: productData.title, img: productData.img, price: productData.price, addedAt: new Date()
    })
}

export const removeFromFavorites = async (uid, productId) => {
    const docRef = doc(db, 'users', uid, 'favorites', productId)
    return await deleteDoc(docRef)
}

export const checkIfFavorite = async (uid, productId) => {
    const docRef = doc(db, 'users', uid, 'favorites', productId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists();
}

export const getUserFavorites = async (uid) => {
    const favCollectionRef = collection(db, 'users', uid, 'favorites');
    const querySnapshot = await getDocs (favCollectionRef)

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const createOrder = async (uid, orderData) => {
    const ordersCollectionRef = collection(db, 'users', uid, 'orders')
    return await addDoc(ordersCollectionRef, {
        ...orderData, 
        createdAt: new Date(),
        status: 'В обработке'
    })
}

export const getUserOrders = async (uid) => {
    const ordersCollectionRef = collection(db, 'users', uid, 'orders')
    const querySnapshot = await getDocs(ordersCollectionRef)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}