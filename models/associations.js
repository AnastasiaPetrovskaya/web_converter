module.exports = function (models) {
    var Token = models.Token,
        Role = models.Role,
        TerminalKey = models.TerminalKey,
        User = models.User,
        CheckPoint = models.CheckPoint,
        CheckPointGroup = models.CheckPointGroup,
        TestCase = models.TestCase,
        TestCaseQuestion = models.TestCaseQuestion,
        DataBase = models.DataBase,
        Question = models.Question,
        QuestionAnswer = models.QuestionAnswer,
        Group = models.Group,
        Student = models.Student,
        Table = models.Table;


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

    //User.belongsTo(Partner, {foreignKey: {name: 'partner_id', allowNull: false}});
    //User.belongsTo(User, {foreignKey: {name: 'parent_id'}});
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
    CheckPoint.hasMany(QuestionAnswer, {as: 'answers', onDelete: 'CASCADE', foreignKey: {name: 'check_point_id', allowNull: true}});
    CheckPoint.hasMany(TestCase, {as: 'test_cases', onDelete: 'CASCADE', foreignKey: {name: 'check_point_id', allowNull: true}});
    CheckPoint.hasMany(CheckPointGroup, {as: 'groups', onDelete: 'CASCADE', foreignKey: {name: 'check_point_id', allowNull: true}});
    
    CheckPointGroup.belongsTo(CheckPoint, {foreignKey: {name: 'check_point_id', allowNull: false}});
    CheckPointGroup.belongsTo(Group, {foreignKey: {name: 'group_id', allowNull: false}});

    DataBase.belongsTo(User, {foreignKey: {name: 'owner_id', allowNull: false}});
    DataBase.hasMany(Table, {as: 'tables', onDelete: 'CASCADE',  foreignKey: {name: 'db_id', allowNull: false}});
    DataBase.hasMany(Question, {as: 'questions', onDelete: 'CASCADE',  foreignKey: {name: 'db_id', allowNull: false}});

    Group.hasMany(Student, {as: 'students', onDelete: 'CASCADE',  foreignKey: {name: 'group_id', allowNull: false}});
    Group.hasMany(CheckPointGroup, {as: 'check_points', onDelete: 'CASCADE',  foreignKey: {name: 'group_id', allowNull: false}});

    Role.hasMany(Token, {foreignKey: {name: 'role_id', allowNull: false}});

    Student.belongsTo(Group, {foreignKey: {name: 'group_id', allowNull: false}});
    Student.hasOne(User, {as: 'user', onDelete: 'CASCADE', foreignKey: {name: 'student_id', allowNull: true}});

    Table.belongsTo(DataBase, {foreignKey: {name: 'db_id', allowNull: false}});

    Token.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
    Token.belongsTo(Role, {foreignKey: {name: 'role_id', allowNull: false}});

    TestCase.belongsTo(CheckPoint, {foreignKey: {name: 'check_point_id', allowNull: false}});
    TestCase.hasMany(TestCaseQuestion, {as: 'questions', onDelete: 'CASCADE', foreignKey: {name: 'test_case_id', allowNull: true}});

    TestCaseQuestion.belongsTo(TestCase, {foreignKey: {name: 'test_case_id', allowNull: false}});
    TestCaseQuestion.belongsTo(Question, {foreignKey: {name: 'question_id', allowNull: false}});

    Question.belongsTo(DataBase, {onDelete: 'CASCADE', foreignKey: {name: 'db_id'}});
    Question.belongsTo(User, {foreignKey: {name: 'owner_id', allowNull: false}});
    Question.hasMany(QuestionAnswer, {as: 'answers', onDelete: 'CASCADE', foreignKey: {name: 'question_id', allowNull: false}});
    Question.hasMany(TestCaseQuestion, {as: 'test_cases', onDelete: 'CASCADE', foreignKey: {name: 'question_id', allowNull: false}});

    QuestionAnswer.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
    QuestionAnswer.belongsTo(Question, {foreignKey: {name: 'question_id', allowNull: false}});
    QuestionAnswer.belongsTo(CheckPoint, {foreignKey: {name: 'check_point_id', allowNull: true}});

    User.hasMany(DataBase, {foreignKey: {name: 'owner_id', allowNull: false}});
    User.hasMany(Question, {foreignKey: {name: 'owner_id', allowNull: false}});
    User.belongsTo(Role, {foreignKey: {name: 'role_id', allowNull: false}});
    User.hasMany(Token, {foreignKey: {name: 'user_id', allowNull: false}});
    User.hasMany(QuestionAnswer, {as: 'answers', onDelete: 'CASCADE', foreignKey: {name: 'user_id', allowNull: false}});
    User.belongsTo(Student, {foreignKey: {name: 'student_id', allowNull: true}});
};
