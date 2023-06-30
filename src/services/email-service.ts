import sgMail from "@sendgrid/mail";
import { getOneEmailee } from "./emailee-service";
import { GameModel } from "../models/game-model";
import { EmaileeModel } from "../models/emailee-model";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendGameAlertEmail = async (game: GameModel) => {
  const { id, invitee, status, turn, roundTurns, moves, winner } = game;
  let emailee: EmaileeModel | null = null;
  let body: string = "";
  let recipientEmail: string = "";

  if (status === "pending") {
    emailee = await getOneEmailee(invitee);
    if (emailee) {
      recipientEmail = emailee.email;
      body =
        "You have been invited to play a game.\n\n" +
        'Please click on the following link to view all your games, invitations will have the "pending" status.\n\n' +
        `${process.env.AUTH0_SPA_URL}/games\n\n`;
    }
  } else if (status === "playing" || status === "challenged") {
    emailee = await getOneEmailee(turn);
    if (emailee) {
      recipientEmail = emailee.email;
      body =
        "You have an active game awaiting your move.\n\n" +
        "Please click on the following link to view the game.\n\n" +
        `${process.env.AUTH0_SPA_URL}/game/${id}\n\n`;
    }
  } else {
    const roundMoveCount = moves[moves.length - 1].length;
    const recipient =
      roundMoveCount % 2 === 0
        ? roundTurns[roundTurns.length - 1][0]
        : roundTurns[roundTurns.length - 1][1];
    emailee = await getOneEmailee(recipient);
    if (emailee) {
      recipientEmail = emailee.email;
      const result =
        winner === recipient ? "won!" : "unfortunately did not win this time.";
      body =
        `One of your games has concluded, and you ${result}\n\n` +
        "Please click on the following link to view the final round result.\n\n" +
        `${process.env.AUTH0_SPA_URL}/game/${id}\n\n`;
    }
  }

  if (recipientEmail) {
    const msg = {
      to: recipientEmail,
      from: process.env.SENDGRID_EMAIL!,
      subject: "Ghost-Multiplayer-Online Game Alert!",
      text: body,
    };
    return sgMail.send(msg);
  }
};

export default sendGameAlertEmail;
