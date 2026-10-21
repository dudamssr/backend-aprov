
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "girlsproject";

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            erro: "Acesso negado. Token não fornecido."
        });
    }

    try {
        const usuarioPayload = jwt.verify(token, SECRET_KEY);

        console.log(
            "DADOS DO USUÁRIO NO TOKEN:",
            usuarioPayload
        );

        if (!usuarioPayload.id) {
            return res.status(401).json({
                erro: "O token não contém um ID de usuário válido."
            });
        }

        req.usuario = usuarioPayload;

        console.log(
            "USUÁRIO AUTENTICADO:",
            req.usuario.id
        );

        next();
    } catch (erro) {
        console.error(
            "ERRO NA AUTENTICAÇÃO:",
            erro.message
        );

        return res.status(403).json({
            erro: "Token inválido ou expirado."
        });
    }
};

const autorizarNivel = (...tipoPermitidos) => {
    return (req, res, next) => {
        if (
            !req.usuario ||
            !tipoPermitidos.includes(req.usuario.tipo)
        ) {
            return res.status(403).json({
                erro: "Acesso negado. Nível de acesso insuficiente."
            });
        }

        next();
    };
};

module.exports = {
    autenticarToken,
    autorizarNivel
};
