// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";
const { mailchimp } = nodes;

export const Root = {
  status: () => {
    if (!state.guildId) {
      return "Please set the audienceId with [configure](:configure)";
    } else {
      return "Ready";
    }
  },
};

export async function configure({ args: { audienceId } }) {
  const audience = mailchimp.audiences.one({ id: audienceId });
  state.name = await audience.name;
  await audience.subscribed.$subscribe(root.handler);
}

export async function handler({ event }) {
  await nodes.sms.send({
    message: `New subscriber on "${state.name}": ${event.email}`,
  });
}
