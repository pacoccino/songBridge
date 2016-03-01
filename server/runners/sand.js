var mongoose = require('mongoose');


// Création du schéma pour les commentaires
var commentaireArticleSchema = new mongoose.Schema({
    pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
    contenu : String,
    date : { type : Date, default : Date.now }
});

// Création du Model pour les commentaires
var CommentaireArticleModel = mongoose.model('commentaires', commentaireArticleSchema);

// On crée une instance du Model
var monCommentaire = new CommentaireArticleModel({ pseudo : 'Atinux' });
monCommentaire.contenu = 'Salut, super article sur Mongoose !';


// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect('mongodb://caca:caca@ds041494.mlab.com:41494/songbridge', function(err) {
    if (err) { throw err; }
});

// On le sauvegarde dans MongoDB !
monCommentaire.save(function (err) {
    if (err) { throw err; }
    console.log('Commentaire ajouté avec succès !');
    // On se déconnecte de MongoDB maintenant
    mongoose.connection.close();
});