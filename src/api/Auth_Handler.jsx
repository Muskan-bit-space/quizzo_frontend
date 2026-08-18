import axios_instance from "./axios";
// import {jwtsetter} from "../lib/auth"
let token=1;
async function signup(email,password){
    let query='/auth/signup'
    const user=await axios_instance(
        {
            method:'post',
            url:query,
            data:{
                email,
                password
            }
        }
    );
    console.log(user);
}
async function signin(email,password){
    let query='/auth/signin'
    const response=await axios_instance(
        {
            method:'post',
            url:query,
            data:{
                email,
                password
            }
        }
    );
    token=response.data.token;
    // jwtsetter(token);
    
    // console.log("token val at frontend: ", token)
    return response
    // console.log(user);
}
const Auth_Handler={
    signup,signin
}

export default Auth_Handler
export {token};//------> otherwise you would need to specify all
// that you are exporting