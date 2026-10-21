
const express = require("express");
const router = express.Router();

const { autenticarToken } = require("../middlewares/auth.middleware");

const {
    listar,
    adicionar,
    atualizar,
    excluir
} = require("../controller/agenda.controller");

router.get("/listar", autenticarToken, listar);
router.post("/adicionar", autenticarToken, adicionar);
router.put("/atualizar/:id", autenticarToken, atualizar);
router.delete("/excluir/:id", autenticarToken, excluir);

module.exports = router;
