module.exports.jogo = function(application, req, res) {

    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {} });
        return;
    }

    var msg = '';

    if (req.query.msg !== '') {
        msg = req.query.msg;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    var usuario = req.session.usuario;
    var casa = req.session.casa;

    JogoDAO.iniciaJogo(res, usuario, casa, msg);

}

module.exports.sair = function(application, req, res) {
    req.session.destroy(function(err) {
        res.render("index", { validacao: {} });
    });
}

module.exports.suditos = function(application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {} });
        return;
    }
    res.render("aldeoes", { validacao: {} });
}

module.exports.pergaminhos = function(application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {} });
        return;
    }

    let connection = application.config.dbConnection;
    let JogoDAO = new application.app.models.JogoDAO(connection);

    let usuario = req.session.usuario;

    JogoDAO.getAcoes(usuario, res);

}

module.exports.ordenarAcaoSudito = function(application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {} });
        return;
    }

    let dadosForm = req.body;

    req.assert("acao", "Ação deve ser informada").notEmpty();
    req.assert("quantidade", "Quantidade deve ser informada").notEmpty();

    let erros = req.validationErrors();

    if (erros) {
        res.redirect("jogo?msg=A");
        return;
    }

    let connection = application.config.dbConnection;
    let JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect("jogo?msg=B");

}