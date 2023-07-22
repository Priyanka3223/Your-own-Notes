import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({email:"",name:"", password:"",cpassword:""})
    let navigate=useNavigate();
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            
            method: "POST", 
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email:credentials.email,name:credentials.name,password:credentials.password})
          });
          const json=await response.json();
          console.log(json);
          if(json.success){
            localStorage.setItem('token',json.auth_token);
            // console.log(token);
            navigate("/")
            props.showalert("successfully created account","success");
          }
          else{
            props.showalert("Invalid credentials","danger");
          }
          
      }
   return (
    <div className="container mt-3">
      <h2>Signup to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email" onChange={onChange}
            className="form-control"
            id="email" name="email"
            aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text" onChange={onChange}
            className="form-control"
            id="name" name="name"
            aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password" onChange={onChange}
            className="form-control"
            id="password" name="password" minLength={5} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password" onChange={onChange}
            className="form-control"
            id="cpassword" name="cpassword" minLength={5} required
          />
        </div>
        <button type="submit"  className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}

export default Signup
