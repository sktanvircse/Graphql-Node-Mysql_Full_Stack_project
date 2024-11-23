import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_CLIENT } from '../mutations/clientMutations';
import { GET_CLIENTS } from '../queries/clientQueries';

export default function AddClientModal() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [addClient, { error }] = useMutation(ADD_CLIENT, {
        variables: { name, email, phone, completed: false },
        update(cache, { data: { addClient } }) {
            const { clients } = cache.readQuery({ query: GET_CLIENTS });

            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: [...clients, addClient] },
            });
        },
        onError(err) {
            console.error('Error adding client:', err.message);
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();

        if (name === '' || email === '' || phone === '') {
            return alert('Please fill in all fields');
        }

        addClient();

        setName('');
        setEmail('');
        setPhone('');
    };

    return (
        <>
            <button
                type='button'
                className='btn btn-secondary'
                data-bs-toggle='modal'
                data-bs-target='#addClientModal'
            >
                <div className='d-flex align-items-center'>
                    <FaUser className='icon' />
                    <div>Add Client</div>
                </div>
            </button>

            <div
                className='modal fade'
                id='addClientModal'
                aria-labelledby='addClientModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='addClientModalLabel'>
                                Add Client
                            </h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'
                            ></button>
                        </div>
                        <div className='modal-body'>
                            <form onSubmit={onSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor='name' className='form-label'>
                                        Name
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='name'
                                        aria-describedby='nameHelp'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <small id='nameHelp' className='form-text text-muted'>
                                        Enter the client's full name.
                                    </small>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='email' className='form-label'>
                                        Email
                                    </label>
                                    <input
                                        type='email'
                                        className='form-control'
                                        id='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='phone' className='form-label'>
                                        Phone
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='phone'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <p className="text-danger">
                                        Failed to add client: {error.message}
                                    </p>
                                )}

                                <button
                                    type='submit'
                                    data-bs-dismiss='modal'
                                    className='btn btn-secondary'
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
