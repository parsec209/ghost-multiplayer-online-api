import CustomError from "../util/custom-error";
import axios from "axios";
import { UserData } from "auth0";

const getAuth0ManagementToken = async (): Promise<string> => {
  const config = {
    method: "POST",
    url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_M2M_CLIENT_ID!,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET!,
      audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
    }),
  };
  const { data } = await axios(config);
  const token: string = data.access_token;
  return token;
};

const getAllUsernames = async (token: string): Promise<string[]> => {
  const config = {
    method: "GET",
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users`,
    headers: { authorization: `Bearer ${token}` },
  };
  const { data }: { data: UserData[] } = await axios(config);
  const usernames = data.map((user): string => user.user_metadata!.username);
  return usernames;
};

const checkForExistingUsername = async (
  token: string,
  username: string
): Promise<void> => {
  const config = {
    method: "GET",
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users`,
    params: {
      q: 'user_metadata.username: "' + username + '"',
      search_engine: "v3",
    },
    headers: { authorization: `Bearer ${token}` },
  };
  const { data } = await axios(config);
  if (data.length) {
    throw new CustomError(500, "Username already exists");
  }
};

const updateOneUsername = async (
  token: string,
  username: string,
  userId: string
): Promise<UserData> => {
  const config = {
    method: "PATCH",
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    data: { user_metadata: { username } },
  };
  const { data }: { data: UserData } = await axios(config);
  return data;
};

const deleteOneUser = async (token: string, userId: string): Promise<void> => {
  const config = {
    method: "DELETE",
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  };
  await axios(config);
};

export {
  getAuth0ManagementToken,
  getAllUsernames,
  checkForExistingUsername,
  updateOneUsername,
  deleteOneUser,
};
