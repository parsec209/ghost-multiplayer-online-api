import { Sequelize } from "sequelize";

const dbURL = process.env.DB_URL;
const sequelize = new Sequelize(dbURL!, { logging: false });

export default sequelize;
