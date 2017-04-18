var crypto = require("crypto");

function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
    let senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
    usuario.senha = senha_criptografada;
    this._connection.open(function(err, mongoclient) {
        mongoclient.collection("usuarios", function(err, collection) {
            collection.insert(usuario);
            mongoclient.close();
        });
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res) {
    let senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
    usuario.senha = senha_criptografada;
    this._connection.open(function(err, mongoclient) {
        mongoclient.collection("usuarios", function(err, collection) {
            collection.find(usuario).toArray(function(err, result) {
                if (result[0] !== undefined) {
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }
                if (req.session.autorizado) {
                    res.redirect("jogo");
                } else {
                    res.render("index", { validacao: [{ msg: 'Usuário e/ou senha inválido(s)' }] });
                }
            });
            mongoclient.close();
        });
    });
}

module.exports = function() {
    return UsuariosDAO;
}