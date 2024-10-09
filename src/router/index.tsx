import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import App from "../App";
import { SignIn, SignUp,Admin,Category,Product } from "../pages";

const Index: React.FC = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route index element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path='admin-layout' element={<Admin/>}>
                <Route path='/admin-layout/category' element={<Category/>}/>
                <Route path='/admin-layout/product' element={<Product/>}/>
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default Index;
