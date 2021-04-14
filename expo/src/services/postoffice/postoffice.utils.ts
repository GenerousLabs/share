import { POSTOFFICE_SEPARATOR } from "../../shared.constants";

export const getPostofficeCodeParams = (postofficeCode: string) => {
  const parts = postofficeCode.split(POSTOFFICE_SEPARATOR);

  // TODO Better validation here
  if (parts.length !== 2) {
    throw new Error("Invalid postofficeCode. #eechOc");
  }
  const [id, password] = parts;

  return { id, password };
};
