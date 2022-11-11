import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { profession } from "../Helper/Profession";


const Form = () => {
  const navigate = useNavigate();
  
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const ageInputRef = useRef();
  const addressInputRef = useRef();
  const phonenumInputRef = useRef();
  const locationXInputRef = useRef();
  const locationYInputRef = useRef();

  const submitButtonHandler = async (event) => {
    event.preventDefault();

    const age = ageInputRef.current.value;

    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;
    const firstName = firstNameInputRef.current.value;
    const lastName = lastNameInputRef.current.value;
    const address = addressInputRef.current.value;
    const phonenum = phonenumInputRef.current.value;

    if (age < 5 || age > 140) alert("Enter a valid age");
    else if (password.length < 8)
      alert("Password must be of at least 8 characters");
    else if (password !== confirmPassword)
      alert("Confirmed password doesn't matches");
    else if (firstName.length === 0 || firstName.length > 50)
      alert("Enter a valid first name");
    else if (lastName.length > 50) alert("Enter a valid last name");
    else if (address.length < 5) alert("Enter a valid address");
    else if (address.length > 500) alert("Address too long");
    else if (phonenum.length !== 10) alert("Phone no. should be of 10 digits");
    else {
      const locationX = locationXInputRef.current.value;
      const locationY = locationYInputRef.current.value;

      const data = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        phonenum: phonenum,
        address: address,
        age: age,
        locationX: locationX,
        locationY: locationY,
      };
      try {
        console.log("got user data");
        const userData = JSON.stringify(data);

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/createAccount`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: userData,
            credentials: "include",
          }
        );

        const responseData = await response.json();
        console.log("response status:", response.status);

        if (response.status === 200) {
          console.log(responseData.message);
          alert("Account created. Please login.");
          navigate("/login");
          return;
        } else if (response.status === 422) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          console.log(responseData.error);
          alert("Looks like there is some issue. Please verify again.");
          navigate("/verifyEmail");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to create account");
        navigate("/verifyEmail");

        return;
      }
    }
  };

  let optionItems = profession.map((item) => (
        <option value={item.id} key={item.name}>{item.name}</option>
    )
  );
  
  return (
    

    <div className="container mx-auto">
    <div className="flex justify-center px-6 my-6 ">

      {/* <!-- Col --> */}
      <div className="w-1/2 bg-white p-5 rounded-lg border ">
        <div className="px-8 mb-4 text-center">
          <img src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png" className="h-10 w-10 inline-block rounded-full border" alt='' />
          {/* <!-- 						<p className="mb-4 text-sm text-gray-700">
           Enter your email address below and we'll send you a
            link to reset your password!
          </p>  --> */}
        </div>

        {/* <!-- complain  --> */}
        <div className="px-8 mb-4 text-center">
          <h2 className="pt-4 mb-2 text-2xl leading-tight">Complain Form</h2>
          {/* <!-- 							<p className="mb-4 text-sm text-gray-700">
           Enter your email address below and we'll send you a
            link to reset your password!
          </p> --> */}
        </div>
        <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">

          {/* <!-- Enter Title --> */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
              Title
            </label>
            <input
              type="text" required
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="title"
              placeholder="Title of complain..."
            />
          </div>



          {/* <!-- Enter Description --> */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              type="text"
              row='10'
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Write your description..."
            />
          </div>

{/* <div className="grid grid-cols-2 grid-flow-row md:grid-flow-col d-flex md:flex-col-1 w-full justify-between mb-4"> */}
          {/* <!-- Enter profession --> */}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="profession">
              Profession
            </label>
            <select
              className="block md:w-1/2 w-full form-controls place-content-center  text-center border-2 border-black rounded-md p-1"
              name="Professions"
              id="Professions"
            >
              <option value="" selected   > --Select Profession--</option>
              {optionItems}
            </select>
            {/* <button
              type="dropbox" required
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="profession"
              
            /> */}
          </div>

          {/* <!-- Enter Phone no --> */}
          <div className="mb-4 large-input block text-sm font-bold text-gray-700">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="phoneno">
              Phone No.
            </label>
            <input
               
              className="w-full px-3 py-2 text-sm  text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
              
              
              id="phoneno"
              placeholder="Enter your phone no..."
            />
          </div>

      {/* <!--Forget Password --> */}
      {/* <div className="mb-6">
        <Link
          className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold  bg-white shadow-sm"
          to="/forgetPassword"
          // onClick={forgetPassword}
        >
          Forget Password?
        </Link>

      </div> */}

      {/* <!-- Enter Description --> */}
      <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="address">
              Address
            </label>
            <textarea
              type="text"
              row='10'
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Your Address..."
            />
          </div>

      {/* <!-- Create button --> */}
      <div className="mb-2 text-center">
        <button
          onClick={submitButtonHandler}
          className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
          type="button"
        >
          Register Complain
        </button>
      </div>
      {/* <hr className="mb-6 border-t" />
      <div className="text-center mb-2">
        Sign in with<a
          className="inline-block text-sm text-blue-500 align-middle hover:text-blue-800"
          href="./register.html"
        >
          <img src="https://qotoqot.com/sad-animations/img/100/sigh/sigh.png" className="h-6 rounded-full border mx-2 w-6 d-flex" alt='' />
        </a>
      </div>
      <div className="text-center">
        Create Account<a
          className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold  bg-white  shadow-sm"
          href="./index.html"
        >
          Sign Up
        </a>
      </div> */}
    </form>
  </div>

</div>
</div >



















// <Container>
//       <form>
//         <div>
//           <input ref={firstNameInputRef} type="text" required />
//           <label>First Name</label>
//         </div>

//         <div>
//           <input ref={lastNameInputRef} type="text" />
//           <label>Last Name</label>
//         </div>

//         <div>
//           <input ref={ageInputRef} type="number" required />
//           <label>Age</label>
//         </div>

//         <div>
//           <input ref={addressInputRef} type="text" required />
//           <label>Address</label>
//         </div>
//         <div>
//           <input ref={phonenumInputRef} type="text" required />
//           <label>Phone No.</label>
//         </div>

//         <input ref={locationXInputRef} type="text" required />
//         <input ref={locationYInputRef} type="text" required />

//         <div>
//           <input ref={passwordInputRef} type="password" required />
//           <label>Password</label>
//         </div>

//         <div>
//           <input ref={confirmPasswordInputRef} type="password" required />
//           <label>Confirm Password</label>
//         </div>

//         <button onClick={submitButtonHandler}>Create</button>
//       </form>
//     </Container>
  );
};

export default Form;