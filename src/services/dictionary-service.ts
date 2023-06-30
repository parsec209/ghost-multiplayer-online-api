import axios from "axios";

const isValidWord = async (word: string): Promise<boolean> => {
  const config = {
    method: "GET",
    url: `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.MERRIAM_WEBSTER_COLLEGIATE_DICTIONARY}`,
  };
  const { data }: { data: any[] } = await axios(config);

  return data.some((e) => {
    if (typeof e === "object") {
      const stems = e.meta.stems;
      return stems.some((stem: string) => {
        if (stem.toLowerCase() === word && !/[A-Z]/.test(stem[0])) {
          return true;
        }
        return false;
      });
    }
    return false;
  });
};

export default isValidWord;
