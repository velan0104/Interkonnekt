import axios from "axios";

export const searchContact = async (req: any, res: any) => {
  try {
    const { searchTerm } = req.body;
    console.log("SEARCH CONTACTS");
    const contacts = axios.post("http://localhost:3000/api/user/query", {
      searchTerm,
      userId: req.user.id,
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};
