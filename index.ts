// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from 'membrane';

export async function subscribe() {
  await nodes.audience.subscriptions.$subscribe(root.handler);
}

export async function unsubscribe() {
  await nodes.audience.subscriptions.$unsubscribe();
}

export async function handler({ event }) {
  const email = await event.member.email_address.$get();
  await nodes.sms.send({ message: `Hello! You have a new subscriber on your website. ${email}` }).$invoke();
}  
