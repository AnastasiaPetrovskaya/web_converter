module.exports = function (models) {
    var Token = models.Token,
        Role = models.Role,
        TerminalKey = models.TerminalKey,
        User = models.User,
        CheckPoint = models.CheckPoint,
        DataBase = models.DataBase;

    //Application.hasMany(Token, {foreignKey: {name: 'application_id', allowNull: false}});

    //Invoice.belongsTo(User, {as: 'sender', foreignKey: {name: 'sender_id', allowNull: false}});
    //Invoice.belongsTo(User, {as: 'recipient', foreignKey: {name: 'recipient_id', allowNull: false}});
    //Invoice.hasMany(Payment, {foreignKey: {name: 'invoice_id', allowNull: false}});

    //Message.belongsTo(User, {as: 'sender', foreignKey: {name: 'sender_id', allowNull: false}});
    //Message.belongsTo(User, {as: 'recipient', foreignKey: {name: 'recipient_id', allowNull: false}});

    //MoneyTransfer.belongsTo(Partner, {as: 'sender', foreignKey: {name: 'sender_id', allowNull: false}});
    //MoneyTransfer.belongsTo(Partner, {as: 'recipient', foreignKey: {name: 'recipient_id', allowNull: false}});

    //MoneyTransaction.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //MoneyTransaction.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //MoneyTransaction.belongsTo(CashierSession, {foreignKey: {name: 'cashier_session_id', allowNull: true}});

    //Partner.hasMany(MoneyTransaction, {foreignKey: {name: 'partner_id'}});
    //Partner.belongsTo(Partner, {as: 'parent', foreignKey: {name: 'parent_id'}});
    //Partner.hasMany(Terminal, {as: 'terminals', foreignKey: 'partner_id'});
    //Partner.hasMany(Partner, {as: 'children', foreignKey: {name: 'parent_id', allowNull: false}});
    //Partner.hasMany(User, {as: 'users', foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(MoneyTransfer, {foreignKey: {name: 'partner_id'}});
    // Partner.hasMany(Player, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(TerminalSession, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(GameBet, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(Sms, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(Card, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(CardSession, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Partner.hasMany(Jackpot, {foreignKey: {name: 'partner_id', allowNull: false}});

    //Payment.belongsTo(User, {as: 'sender', foreignKey: {name: 'sender_id', allowNull: false}});
    //Payment.belongsTo(User, {as: 'recipient', foreignKey: {name: 'recipient_id', allowNull: false}});
    //Payment.belongsTo(Invoice, {as: 'invoice', foreignKey: {name: 'invoice_id', allowNull: false}});

    // Player.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    // Player.hasMany(PlayerSession, {foreignKey: {name: 'player_id', allowNull: false}});

    // PlayerSession.belongsTo(Player, {foreignKey: {name: 'player_id', allowNull: false}});
    // PlayerSession.belongsTo(TerminalSession, {foreignKey: {name: 'terminal_session_id', allowNull: false}});

    Role.hasMany(Token, {foreignKey: {name: 'role_id', allowNull: false}});

    //Sms.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});

    //Jackpot.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});

    //Terminal.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Terminal.belongsTo(TerminalKey, {as: 'os_key', foreignKey: {name: 'os_key_id', allowNull: false}});
    //Terminal.belongsTo(TerminalKey, {as: 'container_key', foreignKey: {name: 'container_key_id', allowNull: false}});
    //Terminal.hasMany(TerminalSession, {foreignKey: {name: 'terminal_id', allowNull: false}});
    //Terminal.hasMany(GameState, {foreignKey: {name: 'terminal_id', allowNull: false}});
    //Terminal.hasMany(TerminalLog, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //Terminal.hasMany(MoneyTransaction, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //Terminal.hasMany(GameBet, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //Terminal.hasMany(BillAcceptor, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //Terminal.hasMany(Dispenser, {foreignKey: {name: 'terminal_id', allowNull: true}});
    //Terminal.hasMany(MoneyEncashment, {foreignKey: {name: 'terminal_id', allowNull: true}});

    //TerminalSession.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});
    //TerminalSession.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    // TerminalSession.hasMany(PlayerSession, {foreignKey: {name: 'terminal_session_id', allowNull: false}});
    //TerminalSession.hasMany(GameBet, {foreignKey: {name: 'terminal_session_id', allowNull: false}});

    //Token.belongsTo(Application, {foreignKey: 'application_id', allowNull: false});
    Token.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
    Token.belongsTo(Role, {foreignKey: {name: 'role_id', allowNull: false}});

    //User.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //User.belongsTo(User, {foreignKey: {name: 'parent_id'}});
    User.belongsTo(Role, {foreignKey: {name: 'role_id', allowNull: false}});
    User.hasMany(Token, {foreignKey: {name: 'user_id', allowNull: false}});
    //User.hasMany(UserLog, {foreignKey: {name: 'user_id', allowNull: false}});

   // UserLog.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});

    //Tape.belongsTo(Game, {foreignKey: {name: 'game_id', allowNull: false}});

    //GameState.belongsTo(Game, {foreignKey: {name: 'game_id', allowNull: false}});
   // GameState.belongsTo(Tape, {foreignKey: {name: 'tape_id', allowNull: false}});
   // GameState.belongsTo(Tape, {foreignKey: {name: 'free_games_tape_id', allowNull: true}});
    //GameState.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});
    //GameState.hasMany(GameBet, {foreignKey: {name: 'game_state_id', allowNull: false}});

    //Game.hasMany(GameState, {foreignKey: {name: 'game_id', allowNull: false}});
    //Game.hasMany(Tape, {foreignKey: {name: 'game_id', allowNull: false}});
    //Game.hasMany(GameBet, {foreignKey: {name: 'game_id', allowNull: false}});

    //GameBet.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //GameBet.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});
    //GameBet.belongsTo(Game, {foreignKey: {name: 'game_id', allowNull: false}});
    //GameBet.belongsTo(GameState, {foreignKey: {name: 'game_state_id', allowNull: false}});
    //GameBet.belongsTo(TerminalSession, {foreignKey: {name: 'terminal_session_id', allowNull: false}});

    //TerminalLog.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: true}});

    //CashierSession.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
    //CashierSession.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});

    //Card.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //Card.hasMany(CardSession, {foreignKey: {name: 'card_id', allowNull: false}});

    //CardSession.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //CardSession.belongsTo(Card, {foreignKey: {name: 'card_id', allowNull: false}});

	//BillAcceptor.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});

	//Dispenser.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});

	//MoneyEncashment.belongsTo(Terminal, {foreignKey: {name: 'terminal_id', allowNull: false}});
    
    CheckPoint.belongsTo(User, {foreignKey: {name: 'owner_id', allowNull: false}});
    DataBase.belongsTo(User, {foreignKey: {name: 'owner_id', allowNull: false}});


};
