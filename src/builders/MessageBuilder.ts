import {
  APIActionRowComponent,
  APIAllowedMentions,
  APIInteractionResponseCallbackData,
  APIMessageActionRowComponent,
  MessageFlags
} from "discord-api-types/v10";
import { ActionRowBuilder } from "..";
import { MessageActionRowComponentBuilders } from "./components";
import { EmbedBuilder } from "./EmbedBuilder";

export class MessageBuilder {
  public data: APIInteractionResponseCallbackData = {};

  public constructor(data?: string | EmbedBuilder | APIInteractionResponseCallbackData) {
    if (data instanceof EmbedBuilder) return this.addEmbeds(data);
    if (typeof data === "string") return this.setContent(data);

    if (data) this.data = data;
  }

  public setContent(content: string) {
    this.data.content = content;

    return this;
  }

  public setTts(tts: boolean) {
    this.data.tts = tts;

    return this;
  }

  public setAllowedMentions(allowedMentions: APIAllowedMentions) {
    this.data.allowed_mentions = allowedMentions;

    return this;
  }

  private setMessageFlag(flag: MessageFlags, value: boolean) {
    if (this.data.flags === undefined) this.data.flags = 0;

    if (value) {
      this.data.flags |= flag;
    } else {
      this.data.flags &= ~flag;
    }

    return this;
  }

  public suppressEmbeds(value: boolean) {
    return this.setMessageFlag(MessageFlags.SuppressEmbeds, value);
  }

  public setEphemeral(value: boolean) {
    return this.setMessageFlag(MessageFlags.Ephemeral, value);
  }

  public addEmbeds(...embeds: EmbedBuilder[]) {
    if (!this.data.embeds) this.data.embeds = [];

    for (const embed of embeds) {
      this.data.embeds.push(embed.toJSON());
    }

    return this;
  }

  public addComponents(...components: ActionRowBuilder<MessageActionRowComponentBuilders>[]) {
    if (!this.data.components) this.data.components = [];

    this.data.components.push(...components.map((component) => component.toJSON()));

    return this;
  }

  public setComponents(components: APIActionRowComponent<APIMessageActionRowComponent>[] = []) {
    if (!this.data.components) this.data.components = [];

    this.data.components = components;

    return this;
  }

  public toJSON(): APIInteractionResponseCallbackData {
    return this.data;
  }
}
