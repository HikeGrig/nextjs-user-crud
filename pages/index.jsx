import { useState, useEffect } from 'react';

import { Link } from 'components';
import { userService } from 'services';

export default Index;

function Index() {
    const [users, setUsers] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    useEffect(() => {
        if(query){
            userService.search(query).then(x => setUsers(x));
        } else {
            userService.getAll().then(x => setUsers(x));
        }
    }, [query]);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Users</h1>
            <div className='row'>
                <div className='col-md-2'>
                    <Link href="/users/add" className="btn w-100 btn-primary mb-2">Add User</Link>
                </div>
                <div className='col-md-10'>
                    <input type="text" value={query} onInput={(e) => setQuery(e.target.value)} className="w-100 form-control" placeholder='Search user'/>
                </div>
            </div>
            <div className='table-responsive'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user =>
                            <tr key={user.id}>
                                <td>{user.title} {user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                    <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                        {user.isDeleting 
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <span>Delete</span>
                                        }
                                    </button>
                                </td>
                            </tr>
                        )}
                        {!users &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="spinner-border spinner-border-lg align-center"></div>
                                </td>
                            </tr>
                        }
                        {users && !users.length &&
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="p-2">No Users To Display</div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
