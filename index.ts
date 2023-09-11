// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";
const { mailchimp } = nodes;

export const Root = {
  status: () => {
    if (!state.name) {
      return "Please [configure](:configure) the audienceId";
    } else {
      return "Ready";
    }
  },
};

export async function configure({ audienceId }) {
  const audience = mailchimp.audiences.one({ id: audienceId });

  // Store the audience name so we can send it in the text.
  state.name = await audience.name;

  // Subscribe to the event. It will unsubscribed when this program is killed.
  await audience.subscribed.$subscribe(root.handler);
}

export async function handler(_, { event }) {
  await nodes.sms.send({
    message: `New subscriber on "${state.name}": ${event.email}`,
  });
}
