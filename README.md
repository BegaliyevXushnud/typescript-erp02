
import React, { Suspense, lazy } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import App from '../App';
import Loading from '../component/loading';

// Lazy load the components
const SignIn = lazy(() => import('../pages/sign-in'));
const SignUp = lazy(() => import('../pages/sign-up'));
const Admin = lazy(() => import('../pages/admin-layout'));
const Category = lazy(() => import('../pages/category'));
const Product = lazy(() => import('../pages/product'));

const Index: React.FC = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route
                    index
                    element={
                        <Suspense fallback={<Loading />}>
                            <SignIn />
                        </Suspense>
                    }
                />
                <Route
                    path="sign-up"
                    element={
                        <Suspense fallback={<Loading />}>
                            <SignUp />
                        </Suspense>
                    }
                />
                <Route
                    path="admin-layout"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Admin />
                        </Suspense>
                    }
                }>
                    <Route
                        path="/admin-layout/category"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Category />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin-layout/product"
                        element={
                            <Suspense fallback={<Loading />}>
                                <Product />
                            </Suspense>
                        }
                    />
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default Index;
