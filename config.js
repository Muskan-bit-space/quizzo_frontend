const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
if(!BACKEND_URL){
    throw new Error("vite bcknd url not def")
}

export {BACKEND_URL}