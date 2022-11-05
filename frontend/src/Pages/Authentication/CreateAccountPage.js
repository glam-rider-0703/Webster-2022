import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const CreateAccountPage = () => {
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

  const submitButtonHandler = (event) => {
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
    else if (phonenum.length !== 10 ) alert("Enter a valid Phone No.");  
    else {
      
      const locationX = locationXInputRef.current.value;
      const locationY = locationYInputRef.current.value;

      const data = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        address: address,
        age: age,
        locationX: locationX,
        locationY: locationY,
      };

      console.log(data);

      navigate("/login");
    }
  };

  return (
    <Container>
      <form>
        <div>
          <input ref={firstNameInputRef} type="text" required />
          <label>First Name</label>
        </div>

        <div>
          <input ref={lastNameInputRef} type="text" />
          <label>Last Name</label>
        </div>

        <div>
          <input ref={ageInputRef} type="number" required />
          <label>Age</label>
        </div>

        <div>
          <input ref={addressInputRef} type="text" required />
          <label>Address</label>
        </div>
        <div>
          <input ref={phonenumInputRef} type="text" required />
          <label>Phone No.</label>
        </div>

        <input ref={locationXInputRef} type="text" required />
        <input ref={locationYInputRef} type="text" required />

        <div>
          <input ref={passwordInputRef} type="password" required />
          <label>Password</label>
        </div>

        <div>
          <input ref={confirmPasswordInputRef} type="" required />
          <label>Confirm Password</label>
        </div>

        <button onClick={submitButtonHandler}>Create</button>
      </form>
    </Container>
  );
};

export default CreateAccountPage;