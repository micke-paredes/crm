import React, { useState } from "react";
import { useFormik } from "formik";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import Layout from "../../../components/Layout";
import * as Yup from 'yup';

const ADD_PRODUCT = gql`
    mutation addProduct($input: productData) {
      addProduct(input: $input) {
        id
        name
        stock
        price
        create
      }
    }
`;

const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
      getProduct(id: $id) {
        id
        name
        price
        stock
      }
    }
`;

const EditProduct = () => {

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(false);
    const [message, setMessage] = useState(null);
    const [ addProduct ] = useMutation(ADD_PRODUCT, {
        update(cache, { data: { addCustomer } }) {
            const { getProduct } = cache.readQuery({ query: GET_PRODUCT });
            cache.writeQuery({
                query: GET_PRODUCT,
                data: {
                    getCustomerBySeller: [...getProduct, addCustomer]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            productName: '',
            stock: '',
            pieces: ''
        },
        validationSchema: Yup.object({
            productName: Yup.string()
                .required('This field is required'),
            stock: Yup.number()
                .required('This field is required')
                .positive('The number of pieces cannot be negative')
                .integer('The stock only accept integer'),
            price: Yup.number()
                .required('This field is required')
                .positive('The number of pieces cannot be negative')
        })
    });

    const showMessage = (errorFlag) => {
        if (message) {
            return (
                <div
                    className={
                        errorFlag
                            ? "bg-red-100 py-3 px-3 w-full  my-2 max-w-sm text-center mx-auto border-l-4 border-red-500 text-red-700 p-3"
                            : "bg-green-100 py-3 px-3 w-full  my-2 max-w-sm text-center mx-auto border-l-4 border-green-500 text-green-700 p-3"
                    }
                >
                    <p>{message}</p>
                </div>
            );
        }
    }

    return (
        <Layout>
            {message && errorMessage === true ? showMessage(true) : showMessage(false)}
            <h1 className="text-2xl text-gray-800 font-light">New Customer</h1>
            <button
                type="button"
                className="btn btn-secondary btn-sm justify-end"
                onClick={() => router.push('/products')}
            >
                <i className="fa fa-arrow-left"></i> Back
            </button>

            <div className="flex justify-center mt-3">
                <form className="bg-gray-100 shadow-xl px-8 pt-6 pb-8 mb-4 border rounded  w-full max-w-lg" onSubmit={formik.handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="productName">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="productName"
                                className="form-control"
                                placeholder="AMD Ryzen 9"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productName}
                            />
                        </div>

                        {
                            formik.touched.productName && formik.errors.productName ? (
                                <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <label className="font-bold">Error</label>
                                    <p className="text-sm">{formik.errors.productName}</p>
                                </div>
                            ) : null
                        }

                        <div className="form-group col-md mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="stock">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                className="form-control"
                                placeholder="Pieces"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.stock}
                            />
                        </div>

                        {
                            formik.touched.stock && formik.errors.stock ? (
                                <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <label className="font-bold">Error</label>
                                    <p className="text-sm">{formik.errors.stock}</p>
                                </div>
                            ) : null
                        }

                        <div className="form-group col-md mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="price">
                                Email
                            </label>
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                placeholder="Price"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                            />
                        </div>

                        {
                            formik.touched.price && formik.errors.price ? (
                                <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <label className="font-bold">Error</label>
                                    <p className="text-sm">{formik.errors.price}</p>
                                </div>
                            ) : null
                        }

                    </div>
                    <div className="form-group col-md">
                        <input className="btn btn-success btn-sm btn-block mt-3 w-full" type="submit" value="Save" />
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default EditProduct;