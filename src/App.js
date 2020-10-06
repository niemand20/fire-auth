import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig)

function App() {
  const [newUser,setNewUser] = useState(false);

  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email: '',
    password: '',
    photo:'',
    error: '',
    success: ''


  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

const handleSignIn= ()=>{
  firebase.auth().signInWithPopup(provider)
  .then(res=>{
    const {displayName,photoURL,email} = res.user;
    const signedInUser ={
      isSignedIn : true,
      name: displayName,
      email: email,
      photo: photoURL

    }
    setUser(signedInUser);
    console.log(displayName,photoURL,email);
  })
  .catch(err=>{
    console.log(err);
    console.log(err.message);
  })

}

  const handleFbSignIn= ()=>{
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('fb user after sign in ', user);      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handleSignOut = ()=>{
  firebase.auth().signOut()
  .then(res=>{
    const signedOutUser = {
      isSignedIn:false,
      name: '',
      photo:'',
      email: ''
    }
    setUser(signedOutUser);
    console.log(res);

  })
  .catch(err=>{

  })
}

const handleBlur = (e) =>{
  
  let isFieldValid = true;
  if(e.target.name === 'email'){
    isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
   

  }
  if (e.target.name==='password'){
    const isPasswordValid = e.target.value.length>6;
    const passwordHasNumber = /\d{1}/.test(e.target.value);
    isFieldValid = isPasswordValid && passwordHasNumber;

  }
  if (isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);
  }
}

const handleSubmit =(e) =>{
  
  if (newUser && user.email && user.password){
   firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
   .then(res=>{
     const newUserInfo = {...user};
     newUserInfo.error = '';
     newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
   })
   .catch(error=> {
    // Handle Errors here.
    const newUserInfo = {...user}; 
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    
    setUser(newUserInfo);
  });

  }
  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newUserInfo = {...user}; 
      newUserInfo.error = '';
      newUserInfo.success = true;

      setUser(newUserInfo);
      console.log('signed in user info', res.user)
    })
  
    .catch(error=>{
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      
    
      setUser(newUserInfo);

    }) 
    
  }
  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newUserInfo = {...user}; 
      newUserInfo.error = '';
      newUserInfo.success = true;

      setUser(newUserInfo);

    })
    .catch(function(error) {
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      
    
      setUser(newUserInfo);
    });
    
    
  }
   e.preventDefault();
}


const updateUserName = name=>{
    const  user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      
    }).then(function() {
      console.log('user name updated successfully');
    }).catch(function(error) {
      console.log(error);
    });


}

  return (
    <div className="App">
      {
        user.isSignedIn?<button onClick = {handleSignOut}>Sign Out</button> :<button onClick = {handleSignIn}>Sign In</button>
      }
      <br/>

      <button onClick = {handleFbSignIn}>Sign in using Facebook</button>
      <br/>

      {
        user.isSignedIn && <div>
          <p>Welcome {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src = {user.photo} alt=''></img>

        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/> 
      <label htmlFor="newUser">New User Sign Up</label>
      
      <form onSubmit ={handleSubmit}>
        {newUser && <input type="text" name="name"  onFocus={handleBlur} placeholder = 'name' id=""/>}
        <br/>
        <input onFocus={handleBlur} type="text" name= 'email' placeholder='email' required/> 
        <br/>
        <input type="password" onFocus={handleBlur} placeholder='password' name="password" id="" required/>
        <br/>
        
        <input type="submit" value={newUser? 'Sign up':'Sign in'} />
        
      </form>
      <p style = {{color:'red'}}>{user.error}</p>

       {
        user.success && <p style = {{color:'green'}}> User {newUser? 'created': 'logged in'} successfully</p>  
       }
    </div>
  );
}

export default App;
