import axios_instance from "./axios";
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
const Auth_Handler={
    signup
}

export default Auth_Handler