import { EmaileeModel, EmaileeAttributes } from "../models/emailee-model";

const getOneEmailee = (username: string): Promise<EmaileeModel | null> => {
  return EmaileeModel.findOne({
    where: {
      username,
    },
  });
};

const postOneEmailee = (data: EmaileeAttributes): Promise<EmaileeModel> => {
  return EmaileeModel.create(data);
};

const deleteOneEmailee = (username: string): Promise<number> => {
  return EmaileeModel.destroy({
    where: {
      username,
    },
  });
};

export { getOneEmailee, postOneEmailee, deleteOneEmailee };
