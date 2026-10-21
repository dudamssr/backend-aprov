const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middlewares/auth.middleware");

const { 
    adicionar, 
    listar, 
    buscar, 
    atualizar, 
    excluir 
} = require("../controller/resposta.controller");

router.post("/adicionar", adicionar); 
router.get("/listar", listar); 
router.get("/buscar/:id", autenticarToken, buscar); 
router.put("/atualizar/:id", autenticarToken, atualizar); 
router.delete("/excluir/:id", autenticarToken, excluir); 

module.exports = router;