import { GameModel, GameInviteAttributes } from "../models/game-model";
import { Op } from "sequelize";
import isValidWord from "./dictionary-service";
import sendGameAlertEmail from "./email-service";

const getAllGames = (username: string): Promise<GameModel[]> => {
  return GameModel.findAll({
    where: {
      [Op.or]: [{ invitee: username }, { inviter: username }],
    },
  });
};

const postOneGame = (data: GameInviteAttributes): Promise<GameModel> => {
  return GameModel.create(data);
};

const updateOneGame = async (updates: GameModel): Promise<GameModel> => {
  const game = await GameModel.findByPk(updates.id);
  game!.set(updates);
  return game!.save();
};

const deleteOneGame = (id: GameModel["id"]): Promise<number> => {
  return GameModel.destroy({
    where: {
      id,
    },
  });
};

const getUpdatedScore = (
  score: string | undefined
): "G" | "GH" | "GHO" | "GHOS" | "GHOST" => {
  switch (score) {
    case "G":
      return "GH";
    case "GH":
      return "GHO";
    case "GHO":
      return "GHOS";
    case "GHOS":
      return "GHOST";
    default:
      return "G";
  }
};

const updateGameFromEvent = async (
  game: GameInviteAttributes | GameModel
): Promise<GameModel> => {
  if (!("id" in game)) {
    const newGame = await postOneGame(game);
    await sendGameAlertEmail(newGame);
    return newGame;
  }

  let {
    id,
    invitee,
    inviter,
    roundTurns,
    turn,
    status,
    moves,
    roundResults,
    inviteeScores,
    inviterScores,
    roundWinners,
    proposedWords,
  } = game;

  if (status === "playing") {
    if (moves.length) {
      const roundMoves = moves[moves.length - 1];
      if (roundMoves.length >= 4) {
        const isValid = await isValidWord(roundMoves);
        if (isValid || roundMoves.length === 45) {
          if (isValid) {
            roundResults.push("spelled word");
          } else if (roundMoves.length === 45) {
            roundResults.push("reached 45 letters");
          }
          if (turn === invitee) {
            inviteeScores.push(
              getUpdatedScore(inviteeScores[inviteeScores.length - 1])
            );
            inviterScores.push(inviterScores[inviterScores.length - 1] || "");
            roundWinners.push(inviter);
          } else {
            inviterScores.push(
              getUpdatedScore(inviterScores[inviterScores.length - 1])
            );
            inviteeScores.push(inviteeScores[inviteeScores.length - 1] || "");
            roundWinners.push(invitee);
          }
          if (
            //CHANGE TO ghost!!!!!!!!!!!!!!!!
            inviteeScores[inviteeScores.length - 1] === "GH" ||
            inviterScores[inviterScores.length - 1] === "GH"
          ) {
            game.status = "completed";
            game.winner = turn === invitee ? inviter : invitee;
            game.turn = "N/A";
          } else {
            const [playerOne, playerTwo] = roundTurns[roundTurns.length - 1];
            roundTurns.push([playerTwo, playerOne]);
            game.turn = playerTwo;
          }
          proposedWords.push("");
        } else {
          game.turn = turn === invitee ? inviter : invitee;
        }
      } else {
        game.turn = turn === invitee ? inviter : invitee;
      }
    }
    const updatedGame = await updateOneGame(game);
    await sendGameAlertEmail(updatedGame);
    return updatedGame;
  }

  if (status === "challenged") {
    const proposedWord = proposedWords[roundTurns.length - 1];
    if (proposedWord) {
      const currentWord = moves[moves.length - 1];
      const beginsWithCurrentWord = proposedWord.indexOf(currentWord) === 0;
      const isValid = await isValidWord(proposedWord);
      const isValidProposedWord = beginsWithCurrentWord && isValid;

      if (isValidProposedWord) {
        roundResults.push("challenge unsuccessful");
      } else {
        roundResults.push("challenge successful");
      }
      if (
        (turn === invitee && isValidProposedWord) ||
        (turn === inviter && !isValidProposedWord)
      ) {
        inviterScores.push(
          getUpdatedScore(inviterScores[inviterScores.length - 1])
        );
        inviteeScores.push(inviteeScores[inviteeScores.length - 1] || "");
        roundWinners.push(invitee);
      } else {
        inviteeScores.push(
          getUpdatedScore(inviteeScores[inviteeScores.length - 1])
        );
        inviterScores.push(inviterScores[inviterScores.length - 1] || "");
        roundWinners.push(inviter);
      }
      if (
        //CHANGE LATER TO GHOST!!!!
        inviteeScores[inviteeScores.length - 1] === "GH" ||
        inviterScores[inviterScores.length - 1] === "GH"
      ) {
        game.status = "completed";
        game.winner =
          inviteeScores[inviteeScores.length - 1] === "GH" ? inviter : invitee;
        game.turn = "N/A";
      } else {
        const [playerOne, playerTwo] = roundTurns[roundTurns.length - 1];
        roundTurns.push([playerTwo, playerOne]);
        game.turn = playerTwo;
        game.status = "playing";
      }
    }
    const updatedGame = await updateOneGame(game);
    await sendGameAlertEmail(updatedGame);
    return updatedGame;
  }

  await deleteOneGame(id);
  return game;
};

export { updateGameFromEvent, getAllGames, postOneGame };
