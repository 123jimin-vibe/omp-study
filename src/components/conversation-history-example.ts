import type { ConversationHistoryBlock } from '../content.ts';
import { el, icon } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

let historySequence = 0;

export function createConversationHistoryExample(data: ConversationHistoryBlock): HTMLElement {
  const id = `conversation-history-${++historySequence}`;
  const figure = el('figure', 'learning-figure conversation-history-example');
  const heading = el('h3', 'learning-figure-heading');
  appendInlineText(heading, data.title);
  heading.id = `${id}-heading`;
  figure.setAttribute('aria-labelledby', heading.id);

  function message(item: ConversationHistoryBlock['nextMessage'], index: number, kind: string): HTMLLIElement {
    const entry = el('li', `history-message history-message-${kind}`);
    entry.value = index;
    const identity = el('span', 'history-identity', String(index));
    identity.setAttribute('aria-hidden', 'true');
    const body = el('div', 'history-message-body');
    const role = el('code', 'history-role');
    appendInlineText(role, item.role);
    const text = el('p', 'history-message-text');
    appendInlineText(text, item.text);
    body.append(role, text);
    entry.append(identity, body);
    return entry;
  }

  function response(item: ConversationHistoryBlock['nextResponse'], index: number, suffix: string): HTMLElement {
    const section = el('section', 'history-response');
    const label = el('h5', 'history-label history-response-label');
    appendInlineText(label, data.labels.response);
    label.id = `${id}-${suffix}-response`;
    section.setAttribute('aria-labelledby', label.id);
    label.prepend(icon('down'));
    const body = el('div', 'history-response-body');
    const list = el('ol', 'history-messages');
    list.start = index;
    list.setAttribute('role', 'list');
    list.append(message(item, index, 'response'));
    body.append(list);
    if (suffix === 'first') {
      const arrow = el('div', 'history-carry-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.append(el('span', 'history-arrow-line'), el('span', 'history-arrow-head'));
      body.append(arrow);
    }
    section.append(label, body);
    return section;
  }

  const flow = el('div', 'history-flow');
  const previousIndex = data.priorInput.length + 1;
  for (const isSecond of [false, true]) {
    const suffix = isSecond ? 'second' : 'first';
    const request = el('section', `history-request history-request-${suffix}`);
    const requestHeading = el('h4', 'history-request-heading');
    appendInlineText(requestHeading, isSecond ? data.labels.secondRequest : data.labels.firstRequest);
    requestHeading.id = `${id}-${suffix}-request`;
    request.setAttribute('aria-labelledby', requestHeading.id);

    const input = el('section', 'history-input');
    const inputHeading = el('h5', 'history-label history-input-label');
    appendInlineText(inputHeading, data.labels.input);
    inputHeading.id = `${id}-${suffix}-input`;
    input.setAttribute('aria-labelledby', inputHeading.id);
    const inputBody = el('div', 'history-input-body');
    const retained = el('ol', 'history-messages');
    retained.setAttribute('role', 'list');
    data.priorInput.forEach((item, index) => retained.append(message(item, index + 1, 'prior')));

    if (isSecond) {
      const carried = el('section', 'history-carried');
      const carriedHeading = el('h6', 'history-label history-group-label');
      appendInlineText(carriedHeading, data.labels.carried);
      carriedHeading.id = `${id}-carried`;
      carried.setAttribute('aria-labelledby', carriedHeading.id);
      retained.append(message(data.previousResponse, previousIndex, 'response'));
      carried.append(carriedHeading, retained);

      const added = el('section', 'history-added');
      const addedHeading = el('h6', 'history-label history-group-label');
      appendInlineText(addedHeading, data.labels.newQuestion);
      addedHeading.id = `${id}-added`;
      added.setAttribute('aria-labelledby', addedHeading.id);
      const addedList = el('ol', 'history-messages');
      addedList.start = previousIndex + 1;
      addedList.setAttribute('role', 'list');
      addedList.append(message(data.nextMessage, previousIndex + 1, 'new'));
      added.append(addedHeading, addedList);
      inputBody.append(carried, added);
    } else {
      inputBody.append(retained);
    }

    input.append(inputHeading, inputBody);
    request.append(requestHeading, input, response(
      isSecond ? data.nextResponse : data.previousResponse,
      isSecond ? previousIndex + 2 : previousIndex,
      suffix,
    ));
    flow.append(request);
  }

  figure.append(heading, flow);
  return figure;
}
