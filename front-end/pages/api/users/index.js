import { usersRepo } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getUsers();
        case 'POST':
            return createUser();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getUsers() {
        if(req.query.query){
            const users = usersRepo.search(req.query.query);
            return res.status(200).json(users);
        } else {
            const users = usersRepo.getAll();
            return res.status(200).json(users);
        }
    }
    
    function createUser() {
        try {
            return res.status(200).json(req.body);

            usersRepo.create(req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }
}
