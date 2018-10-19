var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var modelUser = mongoose.model('User');

let userController = {};

userController.allUsers = (req, res) => {
    modelUser.find()
        .then(results => res.json(results))
        .catch(err => res.send(err));
}

userController.newUser = (req, res) => {
    if (req.body.username && req.body.email && req.body.password) { //verifica se os campos foram preenchidos
        if (req.body.passwordConfirm && req.body.password == req.body.passwordConfirm){//verifica se as senhas conferem

            modelUser.findOne({'email': req.body.email})//verifica se já tem um usuário cadastrado com o email que ele está tentando inserir
            .then(user => {
                if(users){
                    res.json({sucess: false, message: 'Já existe um usuário com esse e-mail'});
                }else{
                    bcrypt.hash(req.body.password, 10)
                    .then(hash =>{
                        let newUser = new modelUser({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash(req.body.password)
                        });

                        newUser.save()
                        .then(() => res.json({sucess: true, message: 'Usuário cadastrado com sucesso', statusCode: 201}))
                        .catch(err => res.json({sucess: false, message: err, statusCode: 400}));
                    })
                    .catch(err => res.json({sucess: false, message: err, statusCode: 400}));
                }                   
                
            })
        }else{
            res.json({sucess: false, message: 'Senhas são diferentes', statusCode: 400});
        }
        
    }else{
        res.json({sucess: false, message: "Por favor preencha todos os campos", statusCode: 400});
    }

}

module.exports = userController;    