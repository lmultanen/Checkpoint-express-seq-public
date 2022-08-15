const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

// class methods on Task
Task.clearCompleted = async function () {
  await this.destroy({
    where: {complete: true}
  });
}

Task.completeAll = async function () {
  await this.update({complete: true},
    {
      where: {complete: false}
    })
}

//instance methods on Task
Task.prototype.getTimeRemaining = function () {
  if (this.due == undefined) {
    return Infinity;
  } else {
    return this.due - new Date();
  }
}

Task.prototype.isOverdue = function () {
  let diff = this.due - new Date();
  if (this.complete) {
    return false;
  }
  return diff < 0;
}

Task.prototype.assignOwner = async function (owner) {
  return await new Promise((resolve,reject) => {
    resolve(this.setOwner(owner))
  });
}

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.belongsTo(Owner);
Owner.hasMany(Task);

//class methods on Owner
Owner.getOwnersAndTasks = async function () {
  let owners = await this.findAll({ include : Task});
  return owners;
}

//instance methods on Owner
Owner.prototype.getIncompleteTasks = async function () {
  let uncompleteTasks = await Task.findAll({
    where: {
      OwnerId: this.id,
      complete: false
    }
  });
  return uncompleteTasks;
}

Owner.addHook('beforeDestroy', (user, options) => {
  if (user.name === 'Grace Hopper') {
    throw "Error: Cannot delete Grace Hopper";
  }
})


//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
