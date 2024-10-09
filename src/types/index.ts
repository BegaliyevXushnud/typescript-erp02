// Global Interfaces
export interface ParamsType {
    limit: number;
    search: string;
    page: number;
  }
  
  export interface ModalProps {
    open: boolean;
    handleClose: () => void;
    update: any;
  }
  
  // Auth Interfaces
  export interface Sign_In {
    phone_number: string;
    password: string;
  }
  
  export interface Sign_Up extends Sign_In {
    first_name: string;
    last_name: string;
    email: string;
  }
  
  export interface AuthRequest {
    sign_in: (data: Sign_In) => Promise<any>;
    sign_up: (data: Sign_Up) => Promise<any>;
  }
  