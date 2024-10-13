import React, { lazy, Suspense } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import App from "../App";
import Loading from '../component/loading';

// Lazy load the components with a delay for demo purposes
const SignIn = lazy(() => delayForDemo(import('../pages/sign-in')));
const SignUp = lazy(() => delayForDemo(import('../pages/sign-up')));
const Admin = lazy(() => delayForDemo(import('../pages/admin-layout')));
const Category = lazy(() => delayForDemo(import('../pages/category')));
const Sub_Category = lazy(() => delayForDemo(import('../pages/sub_category')));
const Product = lazy(() => delayForDemo(import('../pages/product')));
const Brands = lazy(() => delayForDemo(import('../pages/brands')));
const BrandsCategory = lazy(() => delayForDemo(import('../pages/brandcategory')));
const Stock = lazy(() => delayForDemo(import('../pages/stock')));
const Ads = lazy(() => delayForDemo(import('../pages/ads')));
const Setting = lazy(() => delayForDemo(import('../pages/settings')));



const Index: React.FC = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                 <Route index element={<Suspense fallback={<Loading />}><SignIn /></Suspense>} />
                 <Route path="sign-up" element={<Suspense fallback={<Loading />}><SignUp /></Suspense>} />
               <Route path="admin-layout" element={<Suspense fallback={<Loading />}><Admin /></Suspense>}>
               <Route index element={<Suspense fallback={<Loading />}><Product /></Suspense>} />
    <Route path="category" element={<Suspense fallback={<Loading />}><Category /></Suspense>} />
    <Route path="category/sub-category/:id" element={<Suspense fallback={<Loading />}><Sub_Category /></Suspense>} />
    <Route path="brands" element={<Suspense fallback={<Loading />}><Brands /></Suspense>} />
    <Route path="brands-category" element={<Suspense fallback={<Loading />}><BrandsCategory /></Suspense>} />
    <Route path="ads" element={<Suspense fallback={<Loading />}><Ads /></Suspense>} />
    <Route path="stock" element={<Suspense fallback={<Loading />}><Stock /></Suspense>} />
    <Route path="setting" element={<Suspense fallback={<Loading />}><Setting /></Suspense>} />
</Route>

            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

// Function to simulate a delay before resolving the import
function delayForDemo(promise: Promise<any>) {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    }).then(() => promise);
}

export default Index;
