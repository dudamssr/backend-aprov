const express = require("express");

const router = express.Router();

const {
    adicionar,
    listar,
    buscar
} = require("../controller/conteudo.controller");


router.post(  "/adicionar", adicionar);
router.get("/listar",listar);
router.get("/buscar/:id",buscar);


module.exports = router;