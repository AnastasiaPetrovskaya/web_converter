var Student = sequelize.define(
    'student',
    {
    },
    {
        tableName: 'students',
        timestamps: false,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted'
    }
);

module.exports = Student;
