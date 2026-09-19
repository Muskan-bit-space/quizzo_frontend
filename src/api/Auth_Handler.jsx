import axios_instance from "./axios";

async function signup(email, password) {
    const response = await axios_instance({
        method: "post",
        url: "/auth/signup",
        data: {
            email,
            password,
        },
    });

    return response;
}

async function signin(email, password) {
    try {
        const response = await axios_instance({
            method: "post",
            url: "/auth/signin",
            data: {
                email,
                password,
            },
        });

        return response;
    } catch (e) {
        console.log(
            "Error while using signin handler in frontend:",
            e.message
        );

        throw e;
    }
}

async function me(token) {
    try {
        const response = await axios_instance({
            method: "get",
            url: "/auth/me",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response of me in frontend Auth_Handler: ",response)
        return response;
    } catch (e) {
        console.log(
            "Error while getting current user:",
            e.message
        );

        throw e;
    }
}

const Auth_Handler = {
    signup,
    signin,
    me,
};

export default Auth_Handler;
// import axios_instance from "./axios";
// // import {jwtsetter} from "../lib/auth"
// let token=1;
// import auth from '../lib/auth'
// async function signup(email,password){
//     let query='/auth/signup'
//     const user=await axios_instance(
//         {
//             method:'post',
//             url:query,
//             data:{
//                 email,
//                 password
//             }
//         }
//     );
//     console.log(user);
// }
// async function signin(email,password){
//     let query='/auth/signin'
//     try{
//         const response=await axios_instance(
//             {
//                 method:'post',
//                 url:query,
//                 data:{
//                     email,
//                     password
//                 }
//             }
//         );
//         token=response.data.token;
//     // jwtsetter(token);
    
//     // console.log("token val at frontend: ", token)
//         try{
//             auth.token=token;
//             console.log(auth.token)
                
//             }
//         catch(e){
//             console.log("error while setting the localstorage mei jwt: ",e.message)

//         }
//             // console.log(user);
//         return response

//     }
//     catch(e){
//         console.log("err while using signin handler in frontend: ", e.message)
//     }
// }
// async function me({ email, password }) {
//   const {
//     data: { data },
//   } = await axios({
//     method: "get",
//     url: "/api/auth/me",
//     headers: {
//       Authorization: `Bearer ${auth.token || ""}`,
//     },
//   });
//   return data;
// }

// const Auth_Handler={
//     signup,signin,me
// }

// export default Auth_Handler
// export {token};//------> otherwise you would need to specify all
// // that you are exporting