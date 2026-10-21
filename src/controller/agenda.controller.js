
const prisma = require("../data/prisma");

const obterUsuarioId = (req) => {
    const id = Number(req.usuario?.id);

    if (Number.isInteger(id) && id > 0) {
        return id;
    }

    return null;
};

const listar = async (req, res) => {
    try {
        const usuarioId = obterUsuarioId(req);

        if (!usuarioId) {
            console.log("USUÁRIO RECEBIDO:", req.usuario);

            return res.status(401).json({
                erro: "Usuário não autenticado.",
                detalhe: "O ID do usuário não foi encontrado no token."
            });
        }

        const tarefas = await prisma.agendaTarefa.findMany({
            where: { usuarioId },
            orderBy: [
                { data: "asc" },
                { horario: "asc" }
            ]
        });

        return res.status(200).json(tarefas);
    } catch (erro) {
        console.error("ERRO AO LISTAR TAREFAS:", erro);

        return res.status(500).json({
            erro: "Erro interno ao listar tarefas.",
            detalhe: erro.message
        });
    }
};

const adicionar = async (req, res) => {
    try {
        const usuarioId = obterUsuarioId(req);

        if (!usuarioId) {
            console.log("USUÁRIO RECEBIDO:", req.usuario);

            return res.status(401).json({
                erro: "Usuário não autenticado.",
                detalhe: "O ID do usuário não foi encontrado no token."
            });
        }

        const {
            titulo,
            data,
            horario,
            materia,
            tipo,
            prioridade
        } = req.body || {};

        if (typeof titulo !== "string" || !titulo.trim()) {
            return res.status(400).json({
                erro: "O título da tarefa é obrigatório."
            });
        }

        if (
            typeof data !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            isNaN(Date.parse(`${data}T12:00:00`))
        ) {
            return res.status(400).json({
                erro: "Informe uma data válida."
            });
        }

        if (!horario || !materia || !tipo || !prioridade) {
            return res.status(400).json({
                erro: "Preencha todos os campos da tarefa."
            });
        }

        const tarefa = await prisma.agendaTarefa.create({
            data: {
                titulo: titulo.trim(),
                data: new Date(`${data}T12:00:00`),
                horario,
                materia,
                tipo,
                prioridade,
                usuarioId
            }
        });

        return res.status(201).json({
            mensagem: "Tarefa cadastrada com sucesso!",
            tarefa
        });
    } catch (erro) {
        console.error("ERRO AO CADASTRAR TAREFA:", erro);

        return res.status(500).json({
            erro: "Erro interno ao cadastrar tarefa.",
            detalhe: erro.message
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const usuarioId = obterUsuarioId(req);
        const id = Number(req.params.id);

        if (!usuarioId) {
            console.log("USUÁRIO RECEBIDO:", req.usuario);

            return res.status(401).json({
                erro: "Usuário não autenticado.",
                detalhe: "O ID do usuário não foi encontrado no token."
            });
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID da tarefa inválido."
            });
        }

        const existente = await prisma.agendaTarefa.findFirst({
            where: { id, usuarioId }
        });

        if (!existente) {
            return res.status(404).json({
                erro: "Tarefa não encontrada."
            });
        }

        const {
            titulo,
            data,
            horario,
            materia,
            tipo,
            prioridade,
            concluida
        } = req.body || {};

        const dados = {};

        if (titulo !== undefined) {
            if (typeof titulo !== "string" || !titulo.trim()) {
                return res.status(400).json({
                    erro: "O título da tarefa é inválido."
                });
            }

            dados.titulo = titulo.trim();
        }

        if (data !== undefined) {
            if (
                typeof data !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
                isNaN(Date.parse(`${data}T12:00:00`))
            ) {
                return res.status(400).json({
                    erro: "Data inválida."
                });
            }

            dados.data = new Date(`${data}T12:00:00`);
        }

        if (horario !== undefined) dados.horario = horario;
        if (materia !== undefined) dados.materia = materia;
        if (tipo !== undefined) dados.tipo = tipo;
        if (prioridade !== undefined) dados.prioridade = prioridade;

        if (concluida !== undefined) {
            if (typeof concluida !== "boolean") {
                return res.status(400).json({
                    erro: "O campo concluida deve ser true ou false."
                });
            }

            dados.concluida = concluida;
        }

        const tarefa = await prisma.agendaTarefa.update({
            where: { id },
            data: dados
        });

        return res.status(200).json({
            mensagem: "Tarefa atualizada com sucesso!",
            tarefa
        });
    } catch (erro) {
        console.error("ERRO AO ATUALIZAR TAREFA:", erro);

        return res.status(500).json({
            erro: "Erro interno ao atualizar tarefa.",
            detalhe: erro.message
        });
    }
};

const excluir = async (req, res) => {
    try {
        const usuarioId = obterUsuarioId(req);
        const id = Number(req.params.id);

        if (!usuarioId) {
            console.log("USUÁRIO RECEBIDO:", req.usuario);

            return res.status(401).json({
                erro: "Usuário não autenticado.",
                detalhe: "O ID do usuário não foi encontrado no token."
            });
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID da tarefa inválido."
            });
        }

        const tarefa = await prisma.agendaTarefa.findFirst({
            where: { id, usuarioId }
        });

        if (!tarefa) {
            return res.status(404).json({
                erro: "Tarefa não encontrada."
            });
        }

        await prisma.agendaTarefa.delete({
            where: { id }
        });

        return res.status(200).json({
            mensagem: "Tarefa excluída com sucesso!"
        });
    } catch (erro) {
        console.error("ERRO AO EXCLUIR TAREFA:", erro);

        return res.status(500).json({
            erro: "Erro interno ao excluir tarefa.",
            detalhe: erro.message
        });
    }
};

module.exports = {
    listar,
    adicionar,
    atualizar,
    excluir
};
