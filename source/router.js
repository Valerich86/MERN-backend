import { Router, urlencoded, static as staticMiddleware } from "express";
import cors from 'cors';
import { mainPage, detailPage, add, setDone, remove, addendumWrapper, mostActiveUsers, removeAll} from "./controllers/todos.js";
import { register, login, removeUser } from "./controllers/users.js";
import { handleErrors, isGuest, isLoggedIn, loadCurrentUser, middleTest } from "./middleware.js";
import { todoV, registerV, loginV } from "./validators.js";
import { mainErrorHandler, error500Handler } from "./error-handlers.js";

const router = Router();

router.use(cors({
    origin: true,
    credentials: true
}));

router.use('/uploaded', staticMiddleware('storage/uploaded'));

router.use(urlencoded({extended: true}));

router.use(loadCurrentUser);

router.post('/register', isGuest, registerV, handleErrors, register);
router.post('/login', isGuest, loginV, handleErrors, login);

router.use(isLoggedIn);

router.delete('/remove/:name', middleTest, removeAll, removeUser);
router.get('/mostactive', mostActiveUsers);
router.post('/', addendumWrapper, todoV, handleErrors, add);
router.get('/:id', detailPage);
router.put('/:id', setDone);
router.delete('/:id', remove);
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;
