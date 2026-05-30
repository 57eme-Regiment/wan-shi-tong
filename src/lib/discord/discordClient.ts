import { REST, Routes } from 'discord.js';
import { z } from 'zod';

export const GuildMemberSchema = z.object({
  roles: z.string().array(),
});

export type GuildMember = z.infer<typeof GuildMemberSchema>;

export async function fetchGuildMember(
  accessToken: string,
  guildId: string,
): Promise<GuildMember> {
  const rest = new REST({ authPrefix: 'Bearer' }).setToken(accessToken);
  const data = await rest.get(Routes.userGuildMember(guildId));
  return GuildMemberSchema.parse(data);
}
