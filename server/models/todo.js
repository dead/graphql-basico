'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    value: DataTypes.STRING
  }, {});
  Todo.associate = function(models) {
    Todo.belongsTo(models.TodoList, { foreignKey: 'todoListId' })
  };
  return Todo;
};