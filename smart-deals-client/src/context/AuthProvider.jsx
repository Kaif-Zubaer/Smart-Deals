import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../components/firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);

    const createUser = (email, password) => {
        setloading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const userLogin = (email, password) => {
        setloading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleLogin = () => {
        setloading(true);
        return signInWithPopup(auth, googleProvider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const loggedUser = { email: currentUser.email }

                fetch('http://localhost:3000/getToken', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(loggedUser),
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);

                        localStorage.setItem('token', data.token);
                    })
            }
            else {
                localStorage.removeItem('token');
            } 

            setloading(false);
        });
        return () => {
            unsubscribe();
        }
    }, [])

    const userLogOut = () => {
        return signOut(auth);
    }

    const authInfo = {
        user,
        setUser,
        loading,
        setloading,
        createUser,
        userLogin,
        googleLogin,
        userLogOut,
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;