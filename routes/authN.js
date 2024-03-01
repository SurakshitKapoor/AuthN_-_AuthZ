
const express = require("express");
const router = express.Router();

const { signUp, logIn } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post('/signUp', signUp);
router.get('/logIn', logIn);

router.get("/authTest", auth, function(req, resp) {
    resp.send("Testing is perfect");
});
router.get('/student', auth, isStudent, function(req, resp) {
    resp.send("At student route");
})
router.get('/admin', auth, isAdmin, function() {
    resp.send("At Admin route")
})

module.exports = router;