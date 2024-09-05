import { IoIosLogIn } from "react-icons/io";
import CustomizedInput from "../components/shared/CustomizedInput";
import toast from "react-hot-toast";
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
    const auth = useAuth();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            toast.loading("Signing In", {id: "login"});
            await auth?.login(email, password);
            toast.success("Login Successfull", {
              id: "login"
            });
        } catch (error) {
            console.log(error);
            toast.error("Signing In Failed", {id: "login"});
        }
      }
    useEffect(()=>{
      console.log("User state changed:", auth?.user);
      if(auth?.user){
       navigate("/chat");
      }
    }, [auth?.user])
  return (
    <div className="w-full h-full flex flex-1 justify-between">
      <div className="hidden md:flex p-8 mt-8">
        <img src="airobot.png" alt="Robot" className="w-96" />
      </div>
      <div className="flex flex-1 md:flex-1/2 justify-center items-center p-4 ml-auto mt-16">
        <form
          onSubmit={handleSubmit}
          className="m-auto p-8 shadow-lg rounded-lg border-none"
          style={{
            boxShadow: "10px 10px 20px #000",
          }}
        >
          <div className="flex flex-col justify-center">
            <h4 className="text-center text-2xl font-semibold p-4">Login</h4>
            <CustomizedInput type="email" name="email" label="Email" />
            <CustomizedInput type="password" name="password" label="Password" />
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-cyan-400 rounded-lg hover:bg-white hover:text-black transition duration-300 flex items-center justify-center"
            >
              Login
              <IoIosLogIn className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
