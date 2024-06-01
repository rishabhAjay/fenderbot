import { ChannelType, Message } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "messageUpdate",
  execute: async (oldMessage: Message, newMessage: Message) => {},
};

export default event;
