import type { ExchangeBlock } from '../content.ts';
import { el, icon } from './dom.ts';
import { appendInlineText } from './inline-text.ts';

export function createExchangeExample(data: ExchangeBlock): HTMLElement {
  const figure = el('figure', 'learning-figure exchange-example');
  const flow = el('div', 'exchange-flow');
  const input = el('div', 'exchange-port exchange-input');
  const inputLabel = el('p', 'exchange-label');
  const inputText = el('p', 'exchange-text');
  appendInlineText(inputLabel, data.input.label);
  appendInlineText(inputText, data.input.text);
  input.append(inputLabel, inputText);

  const connector = el('div', 'exchange-connector');
  connector.append(icon('right'));
  connector.setAttribute('aria-hidden', 'true');
  const outputs = el('div', 'exchange-outputs');
  for (const output of data.outputs) {
    const port = el('div', 'exchange-port exchange-output');
    const label = el('p', 'exchange-label');
    const text = el('p', 'exchange-text');
    appendInlineText(label, output.label);
    appendInlineText(text, output.text);
    port.append(label, text);
    outputs.append(port);
  }
  if (data.outputs.length > 1) flow.classList.add('exchange-branch');
  flow.append(input, connector, outputs);
  figure.append(flow);
  return figure;
}
