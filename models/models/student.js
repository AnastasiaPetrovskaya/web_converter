var Student = sequelize.define(
    'student',
    {
    },
    {
        tableName: 'students',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted'
    }
);

module.exports = Student;
