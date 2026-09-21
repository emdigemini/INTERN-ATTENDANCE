import express from 'express';
import { authentication } from '../middleware/auth.middleware.js';
import { createAdmin, addNewInterns, editIntern, fetchAllInterns, fetchUnfinishedInterns, loginAdmin, logoutAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/create-admin', createAdmin);
router.post('/new-intern', authentication, addNewInterns);
router.patch('/edit-intern', authentication, editIntern);
router.get('/interns-list', authentication, fetchAllInterns);
router.get('/unfinished-interns', authentication, fetchUnfinishedInterns);
router.post('/login-cnx', loginAdmin);
router.post('/logout-cnx', authentication, logoutAdmin);

export default router