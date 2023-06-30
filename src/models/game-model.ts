import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../db";

interface GameInviteAttributes {
  invitee: string;
  inviter: string;
  roundTurns: string[][];
  turn: string;
}

interface GameModel
  extends GameInviteAttributes,
    Model<InferAttributes<GameModel>, InferCreationAttributes<GameModel>> {
  id: CreationOptional<number>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  status: CreationOptional<
    "pending" | "playing" | "challenged" | "cancelled" | "completed"
  >;
  moves: CreationOptional<string[]>;
  roundResults: CreationOptional<
    Array<
      | "challenge successful"
      | "challenge unsuccessful"
      | "spelled word"
      | "reached 45 letters"
    >
  >;
  winner: CreationOptional<string>;
  inviteeScores: CreationOptional<string[]>;
  inviterScores: CreationOptional<string[]>;
  roundWinners: CreationOptional<string[]>;
  proposedWords: CreationOptional<string[]>;
}

// const Game: ModelDefined<GameAttributes, GameCreationAttributes> =
// sequelize.define("Game", {

const GameModel = sequelize.define<GameModel>("Game", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  invitee: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 20] },
  },
  inviter: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 20] },
  },
  roundTurns: {
    type: DataTypes.ARRAY({
      type: DataTypes.ARRAY(DataTypes.STRING),
    }),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "playing",
      "challenged",
      "cancelled",
      "completed"
    ),
    defaultValue: "pending",
    allowNull: false,
  },
  moves: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  roundResults: {
    type: DataTypes.ARRAY(
      DataTypes.ENUM(
        "challenge successful",
        "challenge unsuccessful",
        "spelled word",
        "reached 45 letters"
      )
    ),
    allowNull: false,
    defaultValue: [],
  },
  turn: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 20] },
  },
  winner: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 20] },
    defaultValue: "N/A",
  },
  inviteeScores: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  inviterScores: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  roundWinners: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
  proposedWords: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
});

export { GameModel, GameInviteAttributes };
