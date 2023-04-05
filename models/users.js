const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0",
      comment: "1=male,2=female,3=other"
    },
    mobile: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    
    
    latitude: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0"
    },
    longitude: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0"
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    otp: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 1111
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    social_type: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0",
      comment: "1=facebook,2=gmail,3=1=android,2=apple"
    },
    social_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0"
    },
    device_type: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0",
      comment: "1=android,2=ios"
    },
    status: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: "0",
      comment: "1=active,0=deactive"
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    device_token: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "0"
    },
    createdAt: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updatedAt'
    }
    , created: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created'
    },
    updated: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated'
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: (record, options) => {
        record.dataValues.created = Math.round(new Date().getTime() / 1000);
        record.dataValues.updated = Math.round(new Date().getTime() / 1000);
      },
      beforeUpdate: (record, options) => {
        record.dataValues.updated = Math.round(new Date().getTime() / 1000);
      },
      beforeBulkCreate: (records, options) => {
        if (Array.isArray(records)) {
          records.forEach(function (record) {
            record.dataValues.created = Math.round(
              new Date().getTime() / 1000
            );
            record.dataValues.updated = Math.round(
              new Date().getTime() / 1000
            );
          });
        }
      },
      beforeBulkUpdate: (records, options) => {
        if (Array.isArray(records)) {
          records.forEach(function (record) {
            record.dataValues.updated = Math.round(
              new Date().getTime() / 1000
            );
          });
        }
      },
    },
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
