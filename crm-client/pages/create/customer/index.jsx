import React, {useState} from 'react';
import {useFormik} from 'formik';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/dist/client/router';
import Layout from '../../../components/Layout';
import * as Yup from 'yup';

const ADD_CUSTOMER = gql`
    mutation addCustomer($input: customerData) {
        addCustomer(input: $input) {
            id
            name
            lastName
            email
            phone
            company
        }
    }
`;

const GET_CUSTOMERS_BY_USER = gql`
    query getCustomerBySeller {
        getCustomerBySeller {
            name
            lastName
            email
            phone
            company
        }
    }
`;

const CreateCustomer = () => {

    const [errorMessage, setErrorMessage] = useState(false);
    const [message, setMessage] = useState(null);
    const [ addCustomer ] = useMutation(ADD_CUSTOMER, {
        update(cache, { data: { addCustomer } }) {
            const { getCustomerBySeller } = cache.readQuery({ query: GET_CUSTOMERS_BY_USER });
            cache.writeQuery({
                query: GET_CUSTOMERS_BY_USER,
                data: {
                    getCustomerBySeller: [...getCustomerBySeller, addCustomer]
                }
            })
        }
    });
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            email: '',
            phone: '',
            company: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('The name is required'),
            lastName: Yup.string().required('The last name is required'),
            email: Yup.string()
                .email('The email is invalid')
                .required('The email is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'The phone is not valid')
                .required('The phone is required'),
            company: Yup.string().required('The company is required'),

        }),
        onSubmit: async formValues => {
            const { name, lastName, email, company, phone } = formValues;
            try {
                const { data } = await addCustomer({
                    variables: {
                        input: {
                            name,
                            lastName,
                            email,
                            company,
                            phone
                        }
                    }
                });
                setMessage('Customer saved successfull');
                setErrorMessage(false);
                setTimeout(() => {
                    setMessage(null);
                    router.push('/');
                }, 3000);
            } catch (error) {
                setErrorMessage(true);
                setMessage(error.message);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        }
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
                onClick={() => router.push('/')}
            >
                <i className="fa fa-arrow-left"></i> Back
            </button>

            <div className="flex justify-center mt-3">
                    <form className="bg-gray-100 shadow-xl px-8 pt-6 pb-8 mb-4 border rounded  w-full max-w-lg" onSubmit={formik.handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Edward"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                />
                            </div>

                            {
                                formik.touched.name && formik.errors.name ? (
                                    <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                        <label className="font-bold">Error</label>
                                        <p className="text-sm">{formik.errors.name}</p>
                                    </div>
                                ) : null
                            }

                            <div className="form-group col-md mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input 
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    placeholder="McLovin"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                />
                            </div>

                            {
                                formik.touched.lastName && formik.errors.lastName ? (
                                    <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                        <label className="font-bold">Error</label>
                                        <p className="text-sm">{formik.errors.lastName}</p>
                                    </div>
                                ) : null
                            }

                            <div className="form-group col-md mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="mail@example.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email} 
                                />
                            </div>

                            {
                                formik.touched.email && formik.errors.email ? (
                                    <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                        <label className="font-bold">Error</label>
                                        <p className="text-sm">{formik.errors.email}</p>
                                    </div>
                                ) : null
                            }

                            <div className="form-group col-md mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="phone">
                                    Phone
                                </label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    maxLength="10"
                                    placeholder="5555363737"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                />
                            </div>

                            {
                                formik.touched.phone && formik.errors.phone ? (
                                    <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                        <label className="font-bold">Error</label>
                                        <p className="text-sm">{formik.errors.phone}</p>
                                    </div>
                                ) : null
                            }

                            <div className="form-group col-md mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="company">
                                    Company
                                </label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="company"
                                    placeholder="Company S.A. de C.V."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.company} 
                                />
                            </div>
                            
                            {
                                formik.touched.company && formik.errors.company ? (
                                    <div className="my-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                        <label className="font-bold">Error</label>
                                        <p className="text-sm">{formik.errors.company}</p>
                                    </div>
                                ) : null
                            }

                        </div>
                        <div className="form-group col-md mb-2">
                            <input className="btn btn-success btn-sm btn-block mt-3 w-full" type="submit" value="Save" />
                        </div>
                    </form>
                </div>
        </Layout>
    )
}

export default CreateCustomer;