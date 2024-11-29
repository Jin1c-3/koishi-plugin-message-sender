import { Context, Schema, h, sleep } from "koishi";
import {} from "koishi-plugin-adapter-onebot";

export const name = "message-sender";

export const inject = ["database"];

export interface Config {
  interval: number;
}

export const Config: Schema<Config> = Schema.object({
  interval: Schema.number()
    .role("slider")
    .min(0.5)
    .max(10)
    .step(0.5)
    .default(1.5)
    .description("发送多条消息的间隔，单位秒"),
});

export function apply(ctx: Context, { interval }: Config) {
  ctx.i18n.define("zh-CN", require("./locales/zh-CN"));
  ctx
    .command("send [...targets:string]", "", { authority: 3 })
    .option("essence", "-e")
    .option("ateverybody", "-a")
    .action(async ({ session, options }, ...targets) => {
      if (targets.length === 0) {
        if (session.guildId) {
          targets.push(session.guildId);
        } else {
          targets.push(session.userId);
        }
      }
      await session.send(session.text(".what_to_send"));
      const reply = await session.prompt();
      if (!reply) {
        return session.text(".timeout");
      }
      const elements = h.parse(reply);
      const guilds = (await session.bot.getGuildList()).data.map(
        (guild) => guild.id
      );
      const friends = (await session.bot.getFriendList()).data.map(
        (friend) => friend.id
      );
      let guild_targets_msgid = [];
      for (let i = 0; i < targets.length; i++) {
        if (i) {
          await sleep(interval * 1000);
        }
        if (guilds.includes(targets[i])) {
          const msgid = await session.bot.sendMessage(targets[i], elements);
          guild_targets_msgid.push(msgid[0]);
          if (options.ateverybody) {
            await session.bot.sendMessage(
              targets[i],
              h.at("", { type: "all" })
            );
          }
        } else if (friends.includes(targets[i])) {
          await session.bot.sendPrivateMessage(targets[i], elements);
        } else {
          await session.send(session.text(".invalid_target", [targets[i]]));
        }
      }
      if (session.onebot && options.essence) {
        for (let i = 0; i < guild_targets_msgid.length; i++) {
          await sleep(interval * 1000);
          await session.bot.internal.setEssenceMsg(guild_targets_msgid[i]);
        }
      }
      return session.text(".sent");
    });
}
