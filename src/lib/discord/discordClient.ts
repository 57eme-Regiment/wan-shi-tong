import { REST, Routes } from 'discord.js';

export type GuildMember = {
  roles: string[];
};

export async function fetchGuildMember(
  accessToken: string,
  guildId: string,
): Promise<GuildMember> {
  const rest = new REST({ authPrefix: 'Bearer' }).setToken(accessToken);
  const data = await rest.get(Routes.userGuildMember(guildId));
  return data as GuildMember;
}
