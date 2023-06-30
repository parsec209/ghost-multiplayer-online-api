import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../db";

interface EmaileeAttributes {
  username: string;
  email: string;
}

interface EmaileeModel
  extends EmaileeAttributes,
    Model<
      InferAttributes<EmaileeModel>,
      InferCreationAttributes<EmaileeModel>
    > {
  id: CreationOptional<number>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const EmaileeModel = sequelize.define<EmaileeModel>("Emailee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 20] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
});

export { EmaileeModel, EmaileeAttributes };
