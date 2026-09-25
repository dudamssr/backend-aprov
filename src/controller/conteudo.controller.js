const {
    materiaExiste,
    conteudoExiste,
    conteudoDuplicadoNaMateria
} = require("../services/conteudo.service");

const prisma = require("../data/prisma");


const adicionar = async (req, res) => {

    try {

        const {
            titulo,
            resumo,
            ordem,
            materiaId
        } = req.body || {};


        if (
            !titulo ||
            typeof titulo !== "string" ||
            titulo.trim() === ""
        ) {
            return res.status(400).json({
                erro: "O título do conteúdo é obrigatório."
            });
        }


        if (
            !resumo ||
            typeof resumo !== "string" ||
            resumo.trim() === ""
        ) {
            return res.status(400).json({
                erro: "O resumo do conteúdo é obrigatório."
            });
        }


        if (
            ordem === undefined ||
            ordem === null ||
            isNaN(Number(ordem))
        ) {
            return res.status(400).json({
                erro: "A ordem do conteúdo deve ser um número válido."
            });
        }


        if (
            !materiaId ||
            isNaN(Number(materiaId))
        ) {
            return res.status(400).json({
                erro: "O ID da matéria é obrigatório e deve ser um número."
            });
        }


        if (!(await materiaExiste(materiaId))) {

            return res.status(404).json({
                erro: "A matéria informada não existe."
            });

        }


        if (
            await conteudoDuplicadoNaMateria(
                titulo,
                materiaId
            )
        ) {

            return res.status(400).json({
                erro: "Já existe um conteúdo com este título nesta matéria."
            });

        }


        const conteudo =
            await prisma.conteudo.create({

                data: {

                    titulo: titulo.trim(),

                    resumo: resumo.trim(),

                    ordem: Number(ordem),

                    materiaId: Number(materiaId)

                }

            });


        return res.status(201).json({

            mensagem:
                "Conteúdo cadastrado com sucesso!",

            conteudo

        });


    } catch (erro) {

        console.error(
            "ERRO AO CADASTRAR CONTEÚDO:",
            erro
        );

        return res.status(500).json({

            erro:
                "Erro interno no servidor ao cadastrar conteúdo."

        });

    }

};


const listar = async (req, res) => {

    try {

        const {
            materiaId
        } = req.query;


        const conteudos =
            await prisma.conteudo.findMany({

                where: materiaId
                    ? {
                        materiaId: Number(materiaId)
                    }
                    : undefined,

                orderBy: {
                    ordem: "asc"
                }

            });


        return res.status(200).json(
            conteudos
        );


    } catch (erro) {

        console.error(
            "ERRO AO LISTAR CONTEÚDOS:",
            erro
        );

        return res.status(500).json({

            erro:
                "Erro interno no servidor ao listar conteúdos."

        });

    }

};


const buscar = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const conteudo =
            await prisma.conteudo.findUnique({

                where: {
                    id: Number(id)
                }

            });


        if (!conteudo) {

            return res.status(404).json({

                erro:
                    "Conteúdo não encontrado."

            });

        }


        return res.status(200).json(
            conteudo
        );


    } catch (erro) {

        console.error(
            "ERRO AO BUSCAR CONTEÚDO:",
            erro
        );

        return res.status(500).json({

            erro:
                "Erro interno no servidor ao buscar conteúdo."

        });

    }

};


module.exports = {

    adicionar,
    listar,
    buscar

};