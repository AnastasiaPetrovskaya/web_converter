module.exports = function (models) {
    var Token = models.Token,
        Role = models.Role,
        TerminalKey = models.TerminalKey,
        User = models.User,
        CheckPoint = models.CheckPoint,
        CheckPointGroup = models.CheckPointGroup,
        TestAnswer = models.TestAnswer,
        TestCase = models.TestCase,
        TestCaseQuestion = models.TestCaseQuestion,
        DataBase = models.DataBase,
        Question = models.Question,
        QuestionAnswer = models.QuestionAnswer,
        Group = models.Group,
        Student = models.Student,
        Table = models.Table;
    
    CheckPoint.belongsTo(User, {foreignKey: {name: 'owner_id', allowNull: false}});
    CheckPoint.hasMany(QuestionAnswer, {as: 'answers', onDelete: 'CASCADE', foreignKey: {name: 'check_point_id', allowNull: true}});
    CheckPoint.hasMany(TestAnswer, {as: 'tests_answers', onDelete: 'CASCADE', foreignKey: {name: 'check_point_id', allowNull: true}});
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

    TestAnswer.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
    TestAnswer.belongsTo(CheckPoint, {foreignKey: {name: 'check_point_id', allowNull: false}});
    TestAnswer.belongsTo(TestCase, {foreignKey: {name: 'test_case_id', allowNull: false}});

    TestCase.belongsTo(CheckPoint, {foreignKey: {name: 'check_point_id', allowNull: false}});
    TestCase.hasMany(TestCaseQuestion, {as: 'questions', onDelete: 'CASCADE', foreignKey: {name: 'test_case_id', allowNull: true}});
    TestCase.hasMany(TestAnswer, {as: 'tests_answers', onDelete: 'CASCADE', foreignKey: {name: 'test_case_id', allowNull: true}});

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
    User.hasMany(TestAnswer, {as: 'tests_answers', onDelete: 'CASCADE', foreignKey: {name: 'user_id', allowNull: false}});
    User.belongsTo(Student, {foreignKey: {name: 'student_id', allowNull: true}});
};
