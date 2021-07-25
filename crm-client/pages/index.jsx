import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import Layout from '../components/Layout';

const GET_CUSTOMERS_BY_USER = gql`
  query getCustomerBySeller {
    getCustomerBySeller {
      id
      name
      lastName
      email
      phone
      company
    }
  }
`;

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID!) {
      deleteCustomer(id: $id)
    }
`;

const Customer = () => {

    const [ customerId, setCustomerId ] = useState(null);
    const { data, loading, error } = useQuery(GET_CUSTOMERS_BY_USER);
    const [ deleteCustomer ] = useMutation(DELETE_CUSTOMER, {
        update(cache) {
            const { getCustomerBySeller } = cache.readQuery({ query: GET_CUSTOMERS_BY_USER});
            cache.writeQuery({
                query: GET_CUSTOMERS_BY_USER,
                data: { getCustomerBySeller: getCustomerBySeller.filter( currentCustomer => currentCustomer.id !== customerId ) }
            });
        }
    });
    const router = useRouter();

    if (loading) return null;
    if (!data.getCustomerBySeller) return router.push('/login');

    const deleteAction = (name, lastName, id) => {
        setCustomerId(id);
        Swal.fire({
            title: 'Are you sure?',
            text: `${name + ' ' + lastName} will be delete`,
            icon: 'warning',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            showCancelButton:true,
            cancelButtonColor: '#d33',
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    });
                    await Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                    )
                    setCustomerId(null);
                } catch (error) {
                    await Swal.fire({
                        title: 'Error',
                        text: `${name + ' ' + lastName} cannot be delete`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        showCancelButton: false,
                        cancelButtonColor: '#d33',
                    })
                }
            }
        })
    }

    const editAction = (id) => {
        router.push({
            pathname: "/edit/customer/[id]",
            query: { id }
        })
    }

    const setColumns = [
        { name: 'Name', selector: 'name', sortable: true },
        { name: 'Last Name', selector: 'lastName', sortable: true },
        { name: 'Email', selector: 'email', sortable: true },
        { name: 'Phone', selector: 'phone', sortable: true },
        { name: 'Company', selector: 'company', sortable: true },
        { name: 'Actions', selector: 'id', sortable: false,
            cell: (row) =>
                <div className="btn-group">
                    <button type="button" className="btn btn-warning btn-sm fa fa-edit" onClick={() => editAction (row.id)}/>
                    <button type="button" className="btn btn-danger btn-sm fa fa-trash" onClick={() => deleteAction(row.name, row.lastName, row.id)}    />
                </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                color: 'black',
                background: 'rgba(147, 197, 253)',
                justifyContent: 'center',
                fontSize: '16px'
            }
        },
        cells: {
            style: {
                justifyContent: 'center',
            }
        },
        rows: {
            style: {
                minHeight: '42px', // override the row height
            }
        },
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Customers</h1>
            <button
                type="button"
                className="btn btn-success btn-sm justify-end"
                onClick={() => router.push('/create/customer')}
            >
                <i className="fa fa-plus"></i> New Customer
            </button>
            <div className="table-responsive">
                <DataTable
                    columns={setColumns}
                    data={data.getCustomerBySeller}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    customStyles={customStyles}
                />
            </div>
        </Layout>
    )
}

export default Customer;
