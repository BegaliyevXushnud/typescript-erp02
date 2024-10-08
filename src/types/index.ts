

// ======== Global ===========
export interface ParamsType {
    limit:number,
    search:string,
    page:number
}

export interface ModalProps {
    open:boolean,
    handleClose:() => void,
    update:any
}

// =========== Auth =================
interface   SignIn {
    phone_number:string,
    password:string
}
interface SignUp extends SignIn {
    first_name:string,
    last_name:string,
    email:string,
}
 export interface AuthRequest{
    sign_in:(data:SignIn) => Promise<any>,
    sign_up:(data:SignUp) => Promise<any>,
}